from datetime import datetime
import json
import os
from pathlib import Path
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    coalesce,
    col,
    count,
    lit,
    sum as spark_sum,
    trim,
    when,
)
from pyspark.sql.types import DoubleType


def encontrar_base_cluster(base_dir: Path) -> Path | None:
    candidatos = [
        base_dir / "cluster",
        base_dir / "backend" / "cluster",
        base_dir / "backend" / "data" / "cluster",
    ]
    for c in candidatos:
        if c.exists() and c.is_dir():
            return c
    return None


def resolver_archivos_activos(cluster_dir: Path | None) -> list[tuple[str, Path, str, str]]:
    """
    Devuelve tuplas: (nombre_nodo, ruta_csv, fuente_lectura, estado_particion)
    Replicación circular: nodo1->nodo2, nodo2->nodo3, nodo3->nodo4, nodo4->nodo1.
    """
    if cluster_dir is None:
        return []

    activos: list[tuple[str, Path, str, str]] = []
    for i in range(1, 5):
        replica_idx = (i % 4) + 1
        candidatos_primarios = [
            cluster_dir / f"nodo{i}" / "infor.csv",
            cluster_dir / f"nodo_{i}" / "primarios" / "infor.csv",
            cluster_dir / f"nodo_{i}" / "primarios" / "registros.csv",
            cluster_dir / f"nodo_{i}" / "infor.csv",
        ]
        candidatos_replicas = [
            cluster_dir / f"nodo{replica_idx}" / "respaldo.csv",
            cluster_dir / f"nodo_{replica_idx}" / "replicas" / f"nodo_{i}" / "infor.csv",
            cluster_dir / f"nodo_{replica_idx}" / "replicas" / f"nodo_{i}" / "registros.csv",
            cluster_dir / f"nodo_{replica_idx}" / "respaldo.csv",
        ]

        primario_valido = next((p for p in candidatos_primarios if p.exists() and p.is_file()), None)
        if primario_valido is not None:
            activos.append((f"nodo{i}", primario_valido, "primario", "PRIMARIO_ACTIVO"))
            continue

        replica_valida = next((r for r in candidatos_replicas if r.exists() and r.is_file()), None)
        if replica_valida is not None:
            activos.append((f"nodo{i}", replica_valida, f"replica_nodo{replica_idx}", "FAILOVER_REPLICA"))

    return activos


def main():
    base_dir = Path(__file__).resolve().parent
    cluster_dir = encontrar_base_cluster(base_dir)
    archivos_activos = resolver_archivos_activos(cluster_dir)

    ruta_salida_json = base_dir / "data" / "analytics" / "resumen_spark.json"

    spark = (
        SparkSession.builder
        .appName("BeautyData-BigData-Processing")
        .master("local[*]")
        .getOrCreate()
    )
    spark.sparkContext.setLogLevel("ERROR")

    if not archivos_activos:
        spark.stop()
        raise RuntimeError(f"No se encontraron archivos CSV activos en {cluster_dir}")

    print("=== FUENTES ACTIVAS DETECTADAS (PRIMARIO / RÉPLICA) ===")
    dataframes_nodos = []
    for nombre_nodo, ruta_csv, fuente, estado_part in archivos_activos:
        print(f" - {nombre_nodo} [{estado_part} | {fuente}]: {ruta_csv}")
        df_n = (
            spark.read
            .option("header", "true")
            .option("inferSchema", "true")
            .csv(str(ruta_csv))
            .withColumn("nodo_particion", lit(nombre_nodo))
            .withColumn("fuente_lectura", lit(fuente))
            .withColumn("estado_particion", lit(estado_part))
        )
        dataframes_nodos.append(df_n)

    df = dataframes_nodos[0]
    for extra in dataframes_nodos[1:]:
        df = df.unionByName(extra, allowMissingColumns=True)

    print("=== ESQUEMA DETECTADO ===")
    df.printSchema()

    total_inicial = df.count()
    print(f"Total de registros leídos en particiones activas: {total_inicial}")

    columnas_meta = {"nodo_particion", "fuente_lectura", "estado_particion"}
    columnas_datos = [c for c in df.columns if c not in columnas_meta]
    df_limpio = df.dropna(how="all", subset=columnas_datos) if columnas_datos else df

    for campo, tipo in df_limpio.dtypes:
        if tipo == "string":
            df_limpio = df_limpio.withColumn(
                campo,
                trim(when(col(campo) == "", None).otherwise(col(campo))),
            )

    # Evita que 'nodo' quede NULL en failover o si viene vacío en el CSV
    if "nodo" in df_limpio.columns and "nodo_particion" in df_limpio.columns:
        df_limpio = df_limpio.withColumn("nodo", coalesce(col("nodo"), col("nodo_particion")))
    elif "nodo" not in df_limpio.columns and "nodo_particion" in df_limpio.columns:
        df_limpio = df_limpio.withColumn("nodo", col("nodo_particion"))

    if "total" in df_limpio.columns:
        df_limpio = df_limpio.withColumn("total", col("total").cast(DoubleType()))

    if "idVenta" in df_limpio.columns:
        df_limpio = df_limpio.dropDuplicates(["idVenta"])
    elif "id" in df_limpio.columns:
        df_limpio = df_limpio.dropDuplicates(["id"])

    total_limpio = df_limpio.count()
    duplicados_eliminados = max(0, total_inicial - total_limpio)
    print(f"Registros duplicados eliminados: {duplicados_eliminados}")
    print(f"Total de registros tras limpieza y deduplicación: {total_limpio}")

    total_recaudado_general = 0.0
    if "total" in df_limpio.columns and total_limpio > 0:
        fila_total = df_limpio.agg(spark_sum("total").alias("suma")).collect()[0]
        if fila_total["suma"] is not None:
            total_recaudado_general = float(fila_total["suma"])

    resumen_exportar = {
        "ejecutado_en": datetime.now().isoformat(timespec="seconds"),
        "modo_ejecucion": "local[*] (simulación lógica 4 nodos)",
        "total_inicial": total_inicial,
        "duplicados_eliminados": duplicados_eliminados,
        "total_limpio": total_limpio,
        "total_registros_limpios": total_limpio,
        "total_recaudado_general": total_recaudado_general,
        "columnas": [c for c in df_limpio.columns if c not in columnas_meta],
        "fuentes_activas": [
            {
                "nodo": n,
                "archivo": str(p),
                "fuente": f,
                "modo": f,
                "estado": est,
            }
            for n, p, f, est in archivos_activos
        ],
        "distribucion_nodos": [],
        "resumen_secundario": {},
    }

    if "nodo" in df_limpio.columns and total_limpio > 0:
        resumen_nodos = (
            df_limpio.groupBy("nodo")
            .agg(count("*").alias("total_registros"))
            .orderBy("nodo")
        )
        print("=== DISTRIBUCIÓN POR NODO ===")
        resumen_nodos.show(truncate=False)
        resumen_exportar["distribucion_nodos"] = [
            row.asDict() for row in resumen_nodos.collect()
        ]

    columnas = df_limpio.columns
    if total_limpio > 0 and "total" in columnas and "nodo" in columnas:
        resumen_ventas_nodo = (
            df_limpio.groupBy("nodo")
            .agg(
                count("*").alias("cantidad_ventas"),
                spark_sum("total").alias("total_recaudado"),
            )
            .orderBy("nodo")
        )
        print("=== TOTAL RECAUDADO POR NODO ===")
        resumen_ventas_nodo.show(truncate=False)
        resumen_exportar["resumen_secundario"] = {
            "tipo": "total_recaudado_por_nodo",
            "datos": [row.asDict() for row in resumen_ventas_nodo.collect()],
        }
    elif total_limpio > 0 and "categoria" in columnas:
        resumen = (
            df_limpio.groupBy("categoria")
            .agg(count("*").alias("total_registros"))
            .orderBy(col("total_registros").desc())
        )
        print("=== RESUMEN POR CATEGORÍA ===")
        resumen.show(truncate=False)
        resumen_exportar["resumen_secundario"] = {
            "tipo": "por_categoria",
            "datos": [row.asDict() for row in resumen.collect()],
        }
    elif total_limpio > 0 and "ciudad" in columnas:
        resumen = (
            df_limpio.groupBy("ciudad")
            .agg(count("*").alias("total_registros"))
            .orderBy(col("total_registros").desc())
        )
        print("=== RESUMEN POR CIUDAD ===")
        resumen.show(truncate=False)
        resumen_exportar["resumen_secundario"] = {
            "tipo": "por_ciudad",
            "datos": [row.asDict() for row in resumen.collect()],
        }
    else:
        print("=== MUESTRA DE DATOS PROCESADOS ===")
        df_limpio.show(10, truncate=False)

    os.makedirs(ruta_salida_json.parent, exist_ok=True)
    with open(ruta_salida_json, "w", encoding="utf-8") as f:
        json.dump(resumen_exportar, f, indent=2, ensure_ascii=False)

    print(f"Resumen JSON guardado en: {ruta_salida_json}")
    spark.stop()


if __name__ == "__main__":
    main()