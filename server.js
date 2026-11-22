const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rutaFrontend = path.join(__dirname, 'frontend');
const rutaCluster = path.join(__dirname, 'cluster');
const rutaData = path.join(__dirname, 'data');
const rutaAnalytics = path.join(rutaData, 'analytics');
const archivoClientes = path.join(rutaData, 'clientes.json');
const archivoEstadoCluster = path.join(rutaData, 'estado_cluster.json');
const archivoVentasCanceladas = path.join(rutaData, 'ventas_canceladas.json');
const archivoResumenSpark = path.join(rutaAnalytics, 'resumen_spark.json');

const scriptPySpark = fs.existsSync(path.join(__dirname, 'procesar_spark.py'))
    ? path.join(__dirname, 'procesar_spark.py')
    : path.join(__dirname, 'analytics', 'procesar_spark.py');

const CATALOGO_INICIAL_INVENTARIO = [
    { id: 101, nombre: 'Base Fit Me', categoria: 'Rostro', precio: 48000, stock: 15 },
    { id: 102, nombre: 'BB Cream', categoria: 'Rostro', precio: 46000, stock: 12 },
    { id: 103, nombre: 'Rubor Compacto', categoria: 'Rostro', precio: 42000, stock: 10 },
    { id: 104, nombre: 'Corrector Fit Me', categoria: 'Rostro', precio: 35000, stock: 18 },
    { id: 105, nombre: 'Polvo Compacto', categoria: 'Rostro', precio: 29000, stock: 14 },
    { id: 201, nombre: 'Máscara de Pestañas Lash Sensational', categoria: 'Ojos', precio: 41000, stock: 15 },
    { id: 202, nombre: 'Delineador de Ojos Liquid Ink', categoria: 'Ojos', precio: 28000, stock: 12 },
    { id: 203, nombre: 'Paleta de Sombras Nudes', categoria: 'Ojos', precio: 52000, stock: 8 },
    { id: 301, nombre: 'Labial Super Stay Matte Ink', categoria: 'Labios', precio: 38000, stock: 20 },
    { id: 302, nombre: 'Brillo Labial Lifter Gloss', categoria: 'Labios', precio: 39000, stock: 14 },
    { id: 303, nombre: 'Delineador Retráctil para Labios', categoria: 'Labios', precio: 22000, stock: 16 },
    { id: 401, nombre: 'Sérum Facial Hidratante', categoria: 'Cuidado facial', precio: 65000, stock: 9 },
    { id: 402, nombre: 'Mascarilla de Carbón Activado', categoria: 'Cuidado facial', precio: 18000, stock: 25 },
    { id: 403, nombre: 'Crema Hidratante Facial', categoria: 'Cuidado facial', precio: 29000, stock: 11 },
    { id: 501, nombre: 'Brocha para Maquillaje Profesional', categoria: 'Accesorios', precio: 28000, stock: 12 },
    { id: 502, nombre: 'Esponja Blender', categoria: 'Accesorios', precio: 15000, stock: 20 }
];

const TOTAL_NODOS = 4;
const CABECERA_INFOR = 'idVenta,cliente,documento,correo,total,fecha,productos,nodo\n';
const CABECERA_RESPALDO = 'idVenta,cliente,documento,correo,total,fecha,productos,nodo\n';

function asegurarArchivo(rutaArchivo, cabecera) {
    const carpeta = path.dirname(rutaArchivo);
    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, { recursive: true });
    }
    if (!fs.existsSync(rutaArchivo)) {
        fs.writeFileSync(rutaArchivo, cabecera, 'utf8');
    }
}

function obtenerCarpetaNodo(numNodo) {
    const normal = path.join(rutaCluster, `nodo${numNodo}`);
    if (fs.existsSync(normal)) return { ruta: normal, caido: false };

    const fallo = path.join(rutaCluster, `nodo${numNodo}_fallo`);
    if (fs.existsSync(fallo)) return { ruta: fallo, caido: true };

    return { ruta: normal, caido: false };
}

function obtenerRutaInfor(numNodo) {
    return path.join(obtenerCarpetaNodo(numNodo).ruta, 'infor.csv');
}

function obtenerRutaRespaldo(numNodo) {
    return path.join(obtenerCarpetaNodo(numNodo).ruta, 'respaldo.csv');
}

// Replicación circular: nodo1 -> nodo2, nodo2 -> nodo3, nodo3 -> nodo4, nodo4 -> nodo1
function obtenerNodoReplica(numNodo) {
    return (numNodo % TOTAL_NODOS) + 1;
}

const leerJSON = (archivo, fallback = null) => {
    if (!fs.existsSync(archivo)) return fallback;
    try {
        return JSON.parse(fs.readFileSync(archivo, 'utf8'));
    } catch {
        return fallback;
    }
};

const guardarJSON = (archivo, datos) => {
    const carpeta = path.dirname(archivo);
    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, { recursive: true });
    }
    fs.writeFileSync(archivo, JSON.stringify(datos, null, 2), 'utf8');
};

function asegurarEstructuraCluster() {
    if (!fs.existsSync(rutaCluster)) fs.mkdirSync(rutaCluster, { recursive: true });
    if (!fs.existsSync(rutaData)) fs.mkdirSync(rutaData, { recursive: true });
    if (!fs.existsSync(rutaAnalytics)) fs.mkdirSync(rutaAnalytics, { recursive: true });
    if (!fs.existsSync(archivoClientes)) guardarJSON(archivoClientes, []);
    if (!fs.existsSync(archivoVentasCanceladas)) guardarJSON(archivoVentasCanceladas, []);
    if (!fs.existsSync(archivoEstadoCluster)) {
        guardarJSON(archivoEstadoCluster, { contadorRotacion: 0 });
    }

    for (let i = 1; i <= TOTAL_NODOS; i++) {
        const infoCarpeta = obtenerCarpetaNodo(i);
        asegurarArchivo(path.join(infoCarpeta.ruta, 'infor.csv'), CABECERA_INFOR);
        asegurarArchivo(path.join(infoCarpeta.ruta, 'respaldo.csv'), CABECERA_RESPALDO);
    }
}

asegurarEstructuraCluster();
app.use(express.static(rutaFrontend));

app.get('/', (req, res) => res.sendFile(path.join(rutaFrontend, 'productos.html')));
app.get('/productos.html', (req, res) => res.sendFile(path.join(rutaFrontend, 'productos.html')));
app.get('/clientes.html', (req, res) => res.sendFile(path.join(rutaFrontend, 'clientes.html')));
app.get('/ventas.html', (req, res) => res.sendFile(path.join(rutaFrontend, 'ventas.html')));
app.get('/inventario.html', (req, res) => res.sendFile(path.join(rutaFrontend, 'inventario.html')));

function normalizarNombre(texto) {
    return String(texto || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function escaparCsv(valor) {
    const str = String(valor ?? '');
    return `"${str.replace(/"/g, '""')}"`;
}

function parsearLineaCsv(linea) {
    const campos = [];
    let actual = '';
    let entreComillas = false;

    for (let i = 0; i < linea.length; i++) {
        const ch = linea[i];
        if (ch === '"') {
            if (entreComillas && linea[i + 1] === '"') {
                actual += '"';
                i++;
            } else {
                entreComillas = !entreComillas;
            }
        } else if (ch === ',' && !entreComillas) {
            campos.push(actual);
            actual = '';
        } else {
            actual += ch;
        }
    }
    campos.push(actual);
    return campos;
}

function leerRegistrosCsv(rutaArchivo) {
    if (!fs.existsSync(rutaArchivo)) return null;
    const lineas = fs
        .readFileSync(rutaArchivo, 'utf8')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);

    if (lineas.length <= 1) return [];

    return lineas.slice(1).map(linea => {
        const [idVenta, cliente, documento, correo, total, fecha, productos, nodo] = parsearLineaCsv(linea);
        return {
            idVenta,
            cliente,
            documento,
            correo,
            total: Number(total) || 0,
            fecha,
            productos,
            nodo
        };
    });
}

function formatearFilaVentaCsv(reg, numNodo) {
    return [
        escaparCsv(reg.idVenta),
        escaparCsv(reg.cliente),
        escaparCsv(reg.documento),
        escaparCsv(reg.correo),
        Number(reg.total) || 0,
        escaparCsv(reg.fecha),
        escaparCsv(reg.productos),
        escaparCsv(reg.nodo || `nodo${numNodo}`)
    ].join(',');
}

function sincronizarNodoDesdeReplica(numNodo) {
    const nodoReplica = obtenerNodoReplica(numNodo);
    const carpetaReplica = obtenerCarpetaNodo(nodoReplica).ruta;
    const rutaRespaldoEnReplica = path.join(carpetaReplica, 'respaldo.csv');
    const rutaInforDestino = path.join(rutaCluster, `nodo${numNodo}`, 'infor.csv');

    asegurarArchivo(rutaInforDestino, CABECERA_INFOR);

    const registrosReplica = leerRegistrosCsv(rutaRespaldoEnReplica) || [];
    const registrosActuales = leerRegistrosCsv(rutaInforDestino) || [];

    const idsExistentes = new Set(registrosActuales.map(r => String(r.idVenta || '').trim()).filter(Boolean));
    const pertenecientesANodo = registrosReplica.filter(r => {
        const n = String(r.nodo || '').trim().toLowerCase();
        return !n || n === `nodo${numNodo}`;
    });

    let agregados = 0;
    const nuevasLineas = [];
    for (const reg of pertenecientesANodo) {
        const id = String(reg.idVenta || '').trim();
        if (id && !idsExistentes.has(id)) {
            idsExistentes.add(id);
            nuevasLineas.push(formatearFilaVentaCsv(reg, numNodo));
            agregados++;
        }
    }

    if (nuevasLineas.length > 0) {
        const contenidoActual = fs.readFileSync(rutaInforDestino, 'utf8');
        const prefijo = contenidoActual.endsWith('\n') || contenidoActual.length === 0 ? '' : '\n';
        fs.appendFileSync(rutaInforDestino, prefijo + nuevasLineas.join('\n') + '\n', 'utf8');
    }

    return { agregados, desde: `${path.basename(carpetaReplica)}/respaldo.csv` };
}

function obtenerVentasSinDuplicar() {
    const mapaPorId = new Map();
    const detalleNodos = [];

    for (let i = 1; i <= TOTAL_NODOS; i++) {
        const estadoCarpeta = obtenerCarpetaNodo(i);
        const nodoReplica = obtenerNodoReplica(i);
        const carpetaReplica = obtenerCarpetaNodo(nodoReplica).ruta;
        const rutaInfor = path.join(estadoCarpeta.ruta, 'infor.csv');
        const rutaRespaldoEnReplica = path.join(carpetaReplica, 'respaldo.csv');

        let registros = estadoCarpeta.caido ? null : leerRegistrosCsv(rutaInfor);
        let fuente = 'primario';

        if (registros === null) {
            const respaldoAll = leerRegistrosCsv(rutaRespaldoEnReplica) || [];
            registros = respaldoAll.filter(r => {
                const n = String(r.nodo || '').trim().toLowerCase();
                return !n || n === `nodo${i}`;
            });
            fuente = `replica_en_${path.basename(carpetaReplica)}`;
        }

        detalleNodos.push({
            nodo: `nodo${i}`,
            caido: estadoCarpeta.caido,
            replicaEn: `nodo${nodoReplica}`,
            fuenteActiva: fuente,
            archivoInfor: rutaInfor,
            archivoRespaldo: rutaRespaldoEnReplica,
            cantidadRegistros: registros.length
        });

        for (const reg of registros) {
            if (reg.idVenta && !mapaPorId.has(reg.idVenta)) {
                mapaPorId.set(reg.idVenta, {
                    ...reg,
                    nodo: reg.nodo || `nodo${i}`
                });
            }
        }
    }

    return {
        ventas: Array.from(mapaPorId.values()),
        detalleNodos
    };
}

function buscarNodoPorMismoNombre(nombre, clientes) {
    const nomNorm = normalizarNombre(nombre);
    if (!nomNorm) return null;

    for (let i = 1; i <= TOTAL_NODOS; i++) {
        const registros = leerRegistrosCsv(obtenerRutaInfor(i)) || [];
        if (registros.some(r => normalizarNombre(r.cliente) === nomNorm)) {
            return i;
        }
    }

    const clienteConNombre = clientes.find(
        c => normalizarNombre(c.nombre) === nomNorm && c.nodoAsignado
    );
    if (clienteConNombre) {
        const match = String(clienteConNombre.nodoAsignado).match(/(\d+)$/);
        if (match) {
            const num = Number(match[1]);
            if (num >= 1 && num <= TOTAL_NODOS) return num;
        }
    }

    return null;
}

function buscarFilasCoincidentesCsv(rutaArchivo, idVentaObjetivo, respaldoDatos = {}) {
    if (!fs.existsSync(rutaArchivo)) return [];
    const lineas = fs.readFileSync(rutaArchivo, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lineas.length <= 1) return [];

    const targetId = String(idVentaObjetivo || '').trim();
    const targetCliente = normalizarNombre(respaldoDatos.cliente || '');
    const targetProducto = normalizarNombre(respaldoDatos.producto || '');
    const encontradas = [];

    for (let i = 1; i < lineas.length; i++) {
        const campos = parsearLineaCsv(lineas[i]);
        const idFila = String(campos[0] || '').trim();
        const clienteFila = normalizarNombre(campos[1] || '');
        const productosFila = normalizarNombre(campos[6] || '');

        const coincideId = targetId && idFila === targetId;
        const coincideRespaldo = targetCliente && clienteFila === targetCliente &&
            (!targetProducto || productosFila.includes(targetProducto));

        if (coincideId || coincideRespaldo) {
            encontradas.push({
                idVenta: campos[0] || '',
                cliente: campos[1] || '',
                documento: campos[2] || '',
                correo: campos[3] || '',
                total: Number(campos[4]) || 0,
                fecha: campos[5] || '',
                productos: campos[6] || '',
                nodo: campos[7] || 'nodo1'
            });
        }
    }
    return encontradas;
}

function eliminarFilaEnArchivoCsv(rutaArchivo, cabecera, idVentaObjetivo, respaldoDatos = {}) {
    if (!fs.existsSync(rutaArchivo)) return 0;
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');
    const lineas = contenido.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lineas.length <= 1) return 0;

    const cabeceraActual = lineas[0] || cabecera.trim();
    const targetId = String(idVentaObjetivo || '').trim();
    const targetCliente = normalizarNombre(respaldoDatos.cliente || '');
    const targetProducto = normalizarNombre(respaldoDatos.producto || '');

    let eliminadas = 0;
    const restantes = [cabeceraActual];

    for (let i = 1; i < lineas.length; i++) {
        const campos = parsearLineaCsv(lineas[i]);
        const idFila = String(campos[0] || '').trim();
        const clienteFila = normalizarNombre(campos[1] || '');
        const productosFila = normalizarNombre(campos[6] || '');

        const coincideId = targetId && idFila === targetId;
        const coincideRespaldo = targetCliente && clienteFila === targetCliente &&
            (!targetProducto || productosFila.includes(targetProducto));

        if (coincideId || coincideRespaldo) {
            eliminadas++;
        } else {
            restantes.push(lineas[i]);
        }
    }

    fs.writeFileSync(rutaArchivo, restantes.join('\n') + '\n', 'utf8');
    return eliminadas;
}

function eliminarVentaDeTodosLosNodos(idVenta, respaldoDatos = {}) {
    let totalEliminadas = 0;
    const nodosAfectados = [];
    const ventasCapturadas = new Map();

    for (let i = 1; i <= TOTAL_NODOS; i++) {
        const nombreNodo = `nodo${i}`;
        const rutaInf = obtenerRutaInfor(i);
        const rutaResp = obtenerRutaRespaldo(i);

        for (const fila of buscarFilasCoincidentesCsv(rutaInf, idVenta, respaldoDatos)) {
            if (fila.idVenta && !ventasCapturadas.has(fila.idVenta)) {
                ventasCapturadas.set(fila.idVenta, { ...fila, nodo: fila.nodo || nombreNodo });
            }
        }
        for (const fila of buscarFilasCoincidentesCsv(rutaResp, idVenta, respaldoDatos)) {
            if (fila.idVenta && !ventasCapturadas.has(fila.idVenta)) {
                ventasCapturadas.set(fila.idVenta, { ...fila, nodo: fila.nodo || nombreNodo });
            }
        }

        const borradasInfor = eliminarFilaEnArchivoCsv(rutaInf, CABECERA_INFOR, idVenta, respaldoDatos);
        const borradasRespaldo = eliminarFilaEnArchivoCsv(rutaResp, CABECERA_RESPALDO, idVenta, respaldoDatos);

        if (borradasInfor > 0 || borradasRespaldo > 0) {
            totalEliminadas += borradasInfor + borradasRespaldo;
            nodosAfectados.push(nombreNodo);
        }
    }

    return {
        totalEliminadas,
        nodosAfectados,
        ventasCanceladas: Array.from(ventasCapturadas.values())
    };
}

let carritoServidor = [];

app.get('/api/productos', (req, res) => {
    res.json({ success: true, productos: CATALOGO_INICIAL_INVENTARIO });
});

app.get('/api/carrito', (req, res) => {
    res.json({ success: true, total: carritoServidor.length, items: carritoServidor });
});

app.post('/api/carrito', (req, res) => {
    const nuevoItem = { id: Date.now() + Math.floor(Math.random() * 100), ...req.body };
    carritoServidor.push(nuevoItem);
    res.status(201).json({ success: true, mensaje: 'Agregado', item: nuevoItem, total: carritoServidor.length });
});

app.delete('/api/carrito/:id', (req, res) => {
    carritoServidor = carritoServidor.filter(item => item.id != req.params.id);
    res.json({ success: true, total: carritoServidor.length });
});

app.get('/api/clientes', (req, res) => res.json(leerJSON(archivoClientes, [])));

app.get('/api/cluster/estado', (req, res) => {
    const { ventas, detalleNodos } = obtenerVentasSinDuplicar();
    const resumenSpark = leerJSON(archivoResumenSpark, null);
    res.json({
        success: true,
        simulacionAcademica: true,
        politicaReplicacion: 'Circular (nodo1->nodo2, nodo2->nodo3, nodo3->nodo4, nodo4->nodo1)',
        totalVentasUnicas: ventas.length,
        montoTotal: ventas.reduce((acc, v) => acc + v.total, 0),
        nodos: detalleNodos,
        ventas,
        spark: resumenSpark
    });
});

app.post('/api/cluster/fallo', (req, res) => {
    const numNodo = Number(req.body?.nodo);
    if (!Number.isInteger(numNodo) || numNodo < 1 || numNodo > TOTAL_NODOS) {
        return res.status(400).json({ success: false, mensaje: 'Nodo inválido (usa 1 a 4).' });
    }

    const origen = path.join(rutaCluster, `nodo${numNodo}`);
    const destinoFallo = path.join(rutaCluster, `nodo${numNodo}_fallo`);

    if (!fs.existsSync(origen)) {
        return res.status(400).json({
            success: false,
            mensaje: fs.existsSync(destinoFallo)
                ? `nodo${numNodo} ya está en fallo.`
                : `No existe la carpeta nodo${numNodo}.`
        });
    }

    try {
        fs.renameSync(origen, destinoFallo);
        const estado = obtenerVentasSinDuplicar();
        const replica = obtenerNodoReplica(numNodo);
        return res.json({
            success: true,
            mensaje: `Fallo simulado en nodo${numNodo} (nodo${numNodo}_fallo). Failover activo hacia nodo${replica}/respaldo.csv.`,
            nodos: estado.detalleNodos,
            ventas: estado.ventas
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            mensaje: `No se pudo simular el fallo en nodo${numNodo}: ${err.message}`
        });
    }
});

app.post('/api/cluster/recuperar', (req, res) => {
    const numNodo = Number(req.body?.nodo);
    if (!Number.isInteger(numNodo) || numNodo < 1 || numNodo > TOTAL_NODOS) {
        return res.status(400).json({ success: false, mensaje: 'Nodo inválido (usa 1 a 4).' });
    }

    const origenFallo = path.join(rutaCluster, `nodo${numNodo}_fallo`);
    const destinoNormal = path.join(rutaCluster, `nodo${numNodo}`);

    if (!fs.existsSync(origenFallo)) {
        return res.status(400).json({
            success: false,
            mensaje: `nodo${numNodo}_fallo no existe (el nodo ya está recuperado o activo).`
        });
    }

    try {
        fs.renameSync(origenFallo, destinoNormal);
        asegurarArchivo(obtenerRutaRespaldo(numNodo), CABECERA_RESPALDO);
        const sync = sincronizarNodoDesdeReplica(numNodo);
        const estado = obtenerVentasSinDuplicar();

        return res.json({
            success: true,
            mensaje: `nodo${numNodo} recuperado como primario y sincronizado desde ${sync.desde} (${sync.agregados} registro(s) restablecido(s)).`,
            nodos: estado.detalleNodos,
            ventas: estado.ventas
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            mensaje: `No se pudo recuperar nodo${numNodo}: ${err.message}`
        });
    }
});

app.get('/api/ventas', (req, res) => {
    const { ventas, detalleNodos } = obtenerVentasSinDuplicar();
    res.json({ success: true, total: ventas.length, ventas, nodos: detalleNodos });
});

app.get('/api/ventas/recuperables', (req, res) => {
    const canceladas = leerJSON(archivoVentasCanceladas, []);
    const { ventas } = obtenerVentasSinDuplicar();
    const idsActivos = new Set(ventas.map(v => String(v.idVenta || '').trim()));
    const disponibles = canceladas.filter(c => !idsActivos.has(String(c.idVenta || '').trim()));
    res.json({ success: true, total: disponibles.length, recuperables: disponibles });
});

app.post('/api/ventas/recuperar', (req, res) => {
    const { idVenta } = req.body || {};
    const canceladas = leerJSON(archivoVentasCanceladas, []);
    const { ventas } = obtenerVentasSinDuplicar();
    const idsActivos = new Set(ventas.map(v => String(v.idVenta || '').trim()));
    const disponibles = canceladas.filter(c => !idsActivos.has(String(c.idVenta || '').trim()));

    if (disponibles.length === 0) {
        return res.status(404).json({ success: false, mensaje: 'No hay compras canceladas disponibles para recuperar.' });
    }

    const objetivo = idVenta
        ? disponibles.find(c => String(c.idVenta).trim() === String(idVenta).trim())
        : disponibles[0];

    if (!objetivo) {
        return res.status(404).json({ success: false, mensaje: 'No se encontró la compra seleccionada para recuperar.' });
    }

    const matchNodo = String(objetivo.nodo || 'nodo1').match(/(\d+)$/);
    const numNodo = matchNodo ? Number(matchNodo[1]) : 1;
    const numNodoReplica = obtenerNodoReplica(numNodo);
    const nombreNodo = `nodo${numNodo}`;

    const rutaInfor = obtenerRutaInfor(numNodo);
    const rutaRespaldo = path.join(obtenerCarpetaNodo(numNodoReplica).ruta, 'respaldo.csv');
    asegurarArchivo(rutaInfor, CABECERA_INFOR);
    asegurarArchivo(rutaRespaldo, CABECERA_RESPALDO);

    const filaCsv = formatearFilaVentaCsv({ ...objetivo, nodo: nombreNodo }, numNodo) + '\n';

    const actualesInfor = leerRegistrosCsv(rutaInfor) || [];
    if (!actualesInfor.some(r => String(r.idVenta).trim() === String(objetivo.idVenta).trim())) {
        const cont = fs.readFileSync(rutaInfor, 'utf8');
        fs.writeFileSync(rutaInfor, cont + (cont.endsWith('\n') || cont.length === 0 ? '' : '\n') + filaCsv, 'utf8');
    }

    const actualesReplica = leerRegistrosCsv(rutaRespaldo) || [];
    if (!actualesReplica.some(r => String(r.idVenta).trim() === String(objetivo.idVenta).trim())) {
        const contRep = fs.readFileSync(rutaRespaldo, 'utf8');
        fs.writeFileSync(rutaRespaldo, contRep + (contRep.endsWith('\n') || contRep.length === 0 ? '' : '\n') + filaCsv, 'utf8');
    }

    const restantesCanceladas = canceladas.filter(c => String(c.idVenta).trim() !== String(objetivo.idVenta).trim());
    guardarJSON(archivoVentasCanceladas, restantesCanceladas);

    const estadoActualizado = obtenerVentasSinDuplicar();
    res.json({
        success: true,
        mensaje: `Compra ${objetivo.idVenta} recuperada en ${nombreNodo} y sincronizada.`,
        ventaRecuperada: objetivo,
        ventas: estadoActualizado.ventas,
        nodos: estadoActualizado.detalleNodos,
        recuperables: restantesCanceladas
    });
});

app.post('/api/ventas', (req, res) => {
    const { documento, nombre, correo, idVenta: idVentaRecibido } = req.body || {};

    if (carritoServidor.length === 0) {
        return res.status(400).json({ success: false, mensaje: 'El carrito está vacío' });
    }

    const clientes = leerJSON(archivoClientes, []);
    const estadoCluster = leerJSON(archivoEstadoCluster, { contadorRotacion: 0 });

    const nomLimpio = nombre ? String(nombre).trim() : '';
    const docLimpio = documento ? String(documento).trim() : '';
    const corLimpio = correo ? String(correo).trim().toLowerCase() : '';

    let numNodo = buscarNodoPorMismoNombre(nomLimpio, clientes);

    if (!numNodo) {
        const actual = Number(estadoCluster.contadorRotacion || 0);
        numNodo = (actual % TOTAL_NODOS) + 1;
        estadoCluster.contadorRotacion = actual + 1;
    }

    const numNodoReplica = obtenerNodoReplica(numNodo);
    const nombreNodo = `nodo${numNodo}`;
    const nombreNodoReplica = `nodo${numNodoReplica}`;

    let clienteRegistro = clientes.find(
        c => nomLimpio && normalizarNombre(c.nombre) === normalizarNombre(nomLimpio)
    );

    if (clienteRegistro) {
        clienteRegistro.comprasRealizadas = (clienteRegistro.comprasRealizadas || 1) + 1;
        clienteRegistro.ultimaCompra = new Date().toLocaleString('es-CO');
        clienteRegistro.nodoAsignado = nombreNodo;
        if (docLimpio) clienteRegistro.documento = docLimpio;
        if (corLimpio) clienteRegistro.correo = corLimpio;
    } else {
        clienteRegistro = {
            id: `CLI-${clientes.length + 1}`,
            documento: docLimpio || `DOC-${Date.now().toString().slice(-5)}`,
            nombre: nomLimpio || `Cliente ${clientes.length + 1}`,
            correo: corLimpio || `cliente${clientes.length + 1}@beautydata.local`,
            comprasRealizadas: 1,
            fechaRegistro: new Date().toLocaleString('es-CO'),
            ultimaCompra: new Date().toLocaleString('es-CO'),
            nodoAsignado: nombreNodo
        };
        clientes.push(clienteRegistro);
    }

    const totalVenta = carritoServidor.reduce((acc, item) => acc + Number(item.precio), 0);
    const idVenta = idVentaRecibido
        ? String(idVentaRecibido).trim()
        : `VTA-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`;
    const fechaActual = new Date().toLocaleString('es-CO');
    const listaProductosNombres = carritoServidor.map(p => p.nombre).join(' | ');

    const filaCsv = [
        escaparCsv(idVenta),
        escaparCsv(clienteRegistro.nombre),
        escaparCsv(clienteRegistro.documento),
        escaparCsv(clienteRegistro.correo),
        totalVenta,
        escaparCsv(fechaActual),
        escaparCsv(listaProductosNombres),
        escaparCsv(nombreNodo)
    ].join(',') + '\n';

    const rutaInforNodo = obtenerRutaInfor(numNodo);
    const rutaRespaldoCircular = path.join(rutaCluster, `nodo${numNodoReplica}`, 'respaldo.csv');

    asegurarArchivo(rutaInforNodo, CABECERA_INFOR);
    asegurarArchivo(rutaRespaldoCircular, CABECERA_RESPALDO);

    fs.appendFileSync(rutaInforNodo, filaCsv, 'utf8');
    fs.appendFileSync(rutaRespaldoCircular, filaCsv, 'utf8');

    guardarJSON(archivoClientes, clientes);
    guardarJSON(archivoEstadoCluster, estadoCluster);
    carritoServidor = [];

    res.status(201).json({
        success: true,
        clienteId: clienteRegistro.id,
        mensaje: `¡Venta registrada en ${nombreNodo} (infor.csv) con réplica en ${nombreNodoReplica} (respaldo.csv)!`,
        venta: {
            idVenta,
            cliente: clienteRegistro.nombre,
            total: totalVenta,
            nodo: nombreNodo,
            nodoReplica: nombreNodoReplica,
            rutaInfor: rutaInforNodo,
            rutaRespaldo: rutaRespaldoCircular
        }
    });
});

app.delete('/api/ventas/:idVenta', (req, res) => {
    const idVenta = decodeURIComponent(String(req.params.idVenta || '')).trim();
    const { cliente, producto } = req.body || {};

    if (!idVenta && !cliente) {
        return res.status(400).json({ success: false, mensaje: 'Falta idVenta o datos de la venta para eliminar.' });
    }

    const resultado = eliminarVentaDeTodosLosNodos(idVenta, { cliente, producto });

    if (resultado.ventasCanceladas && resultado.ventasCanceladas.length > 0) {
        const canceladasActuales = leerJSON(archivoVentasCanceladas, []);
        const mapaCanceladas = new Map(
            canceladasActuales.map(v => [String(v.idVenta || '').trim(), v])
        );
        for (const vc of resultado.ventasCanceladas) {
            if (vc.idVenta) {
                mapaCanceladas.set(String(vc.idVenta).trim(), vc);
            }
        }
        guardarJSON(archivoVentasCanceladas, Array.from(mapaCanceladas.values()));
    }

    carritoServidor = carritoServidor.filter(item => {
        const coincideId = idVenta && (String(item.idVenta || '') === idVenta || String(item.id || '') === idVenta);
        const coincideProd = !idVenta && producto && normalizarNombre(item.nombre) === normalizarNombre(producto);
        return !(coincideId || coincideProd);
    });

    const estado = obtenerVentasSinDuplicar();

    res.json({
        success: true,
        eliminada: resultado.totalEliminadas > 0,
        idVenta,
        totalEliminadas: resultado.totalEliminadas,
        nodosAfectados: resultado.nodosAfectados,
        nodos: estado.detalleNodos,
        ventas: estado.ventas,
        mensaje: resultado.totalEliminadas > 0
            ? `Venta eliminada de ${resultado.nodosAfectados.join(', ')} (infor.csv y respaldo.csv).`
            : 'No se encontró fila coincidente en los CSV de los nodos, se sincronizó el estado.'
    });
});

app.post('/api/analytics/ejecutar', (req, res) => {
    if (!fs.existsSync(scriptPySpark)) {
        return res.status(404).json({
            success: false,
            mensaje: `No se encontró el script PySpark en ${scriptPySpark}`
        });
    }

    const comandoPython = process.platform === 'win32' ? 'python' : 'python3';
    const inicio = Date.now();

    execFile(comandoPython, [scriptPySpark], { cwd: __dirname }, (error, stdout, stderr) => {
        const duracionMs = Date.now() - inicio;

        if (error) {
            return res.status(500).json({
                success: false,
                mensaje: 'Error ejecutando el análisis con PySpark',
                detalle: stderr || error.message,
                duracionMs
            });
        }

        const resumenSpark = leerJSON(archivoResumenSpark, null);
        const estado = obtenerVentasSinDuplicar();

        res.json({
            success: true,
            mensaje: 'Procesamiento PySpark completado',
            duracionMs,
            salidaConsola: stdout,
            spark: resumenSpark,
            nodos: estado.detalleNodos,
            ventas: estado.ventas
        });
    });
});

app.get('/api/analytics/resumen', (req, res) => {
    const resumenSpark = leerJSON(archivoResumenSpark, null);
    const { ventas, detalleNodos } = obtenerVentasSinDuplicar();

    const ventasPorNodo = {};
    const montoPorNodo = {};
    for (let i = 1; i <= TOTAL_NODOS; i++) {
        ventasPorNodo[`nodo${i}`] = 0;
        montoPorNodo[`nodo${i}`] = 0;
    }

    for (const v of ventas) {
        const key = v.nodo || 'nodo1';
        if (ventasPorNodo[key] !== undefined) {
            ventasPorNodo[key] += 1;
            montoPorNodo[key] += v.total;
        }
    }

    res.json({
        success: true,
        fuenteSparkDisponible: Boolean(resumenSpark),
        spark: resumenSpark,
        metricasTiempoReal: {
            totalVentas: ventas.length,
            montoTotal: ventas.reduce((acc, v) => acc + v.total, 0),
            ventasPorNodo,
            montoPorNodo,
            nodos: detalleNodos
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor público listo en http://localhost:${PORT}`);
});