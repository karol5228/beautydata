document.addEventListener("DOMContentLoaded", () => {
    const formatoCOP = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    });

    const tbodyInventario = document.getElementById("tablaInventarioBody");
    const contenedorGrafica = document.getElementById("graficaCategorias");

    if (!tbodyInventario || !contenedorGrafica) return;

    // Catálogo base de respaldo por si el localStorage está vacío
    const productosBase = [
        { id: 1, nombre: "Base Fit Me", marca: "Maybelline", categoria: "Rostro", precio: 48000 },
        { id: 2, nombre: "Corrector Fit Me", marca: "Maybelline", categoria: "Rostro", precio: 35000 },
        { id: 3, nombre: "Labial Matte Ink", marca: "Maybelline", categoria: "Labios", precio: 38000 },
        { id: 4, nombre: "Paleta de Sombras Nudes", marca: "Vogue", categoria: "Ojos", precio: 52000 },
        { id: 5, nombre: "Polvo Compacto", marca: "Vogue", categoria: "Rostro", precio: 25000 }
    ];

    // Obtenemos los productos desde localStorage o cargamos la base por defecto
    let listaProductos = JSON.parse(localStorage.getItem("beautydata_inventario")) || [];
    
    if (listaProductos.length === 0) {
      listaProductos = productosBase;
      localStorage.setItem("beautydata_inventario", JSON.stringify(listaProductos));
    }

    if (listaProductos.length > 0) {
      // 1. Actualizar métricas KPI
      document.getElementById("totalProductos").textContent = listaProductos.length;
      
      const valorTotal = listaProductos.reduce((acc, p) => acc + (p.precio || 0), 0);
      document.getElementById("kpiValorInventario").textContent = formatoCOP.format(valorTotal);

      // 2. Llenar la tabla de inventario
      tbodyInventario.innerHTML = listaProductos.map(p => `
        <tr>
          <td><strong>#${p.id || '01'}</strong></td>
          <td>${p.nombre || p.producto}</td>
          <td>${p.marca || 'BeautyData'}</td>
          <td>${p.categoria || 'General'}</td>
          <td><strong>${formatoCOP.format(p.precio || 0)}</strong></td>
          <td><span class="badge-stock">Disponible (Stock OK)</span></td>
        </tr>
      `).join("");

      // 3. Generar la analítica visual / gráfica de barras por categoría
      const categoriasMap = {};
      listaProductos.forEach(p => {
        const cat = p.categoria || "General";
        categoriasMap[cat] = (categoriasMap[cat] || 0) + 1;
      });

      let htmlBarras = "";
      const maxCatValue = Math.max(...Object.values(categoriasMap), 1);

      for (const [categoria, cantidad] of Object.entries(categoriasMap)) {
        const porcentaje = (cantidad / maxCatValue) * 100;
        htmlBarras += `
          <div class="category-bar-item">
            <div class="category-bar-label">
              <span>${categoria}</span>
              <span><strong>${cantidad}</strong> productos en stock</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${porcentaje}%;"></div>
            </div>
          </div>
        `;
      }
      contenedorGrafica.innerHTML = htmlBarras;

    } else {
      document.getElementById("totalProductos").textContent = "0";
      document.getElementById("kpiValorInventario").textContent = "$0";
      tbodyInventario.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No se encontraron productos cargados en el sistema.</td></tr>`;
      contenedorGrafica.innerHTML = `<p style="color: var(--muted); text-align:center;">No hay datos analíticos disponibles.</p>`;
    }
});