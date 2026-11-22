document.addEventListener("DOMContentLoaded", () => {
    cargarYMostrarVentas();
});

function cargarYMostrarVentas() {
    // Obtenemos los pedidos guardados o un arreglo vacío si no hay nada
    let pedidos = JSON.parse(localStorage.getItem("beautydata_pedidos")) || [];

    const tablaVentas = document.getElementById("tabla-ventas"); // ID de tu tabla en el HTML
    if (!tablaVentas) return;

    tablaVentas.innerHTML = "";

    if (pedidos.length === 0) {
        tablaVentas.innerHTML = `<tr><td colspan="6" class="text-center">No hay ventas registradas en este nodo.</td></tr>`;
        return;
    }

    // Obtenemos el cliente actual del navegador para identificar si eres "Tú"
    const clienteActual = JSON.parse(localStorage.getItem("beautydata_ultimo_cliente")) || {};

    // Recorremos cada pedido para pintarlo fila por fila
    pedidos.forEach((pedido, index) => {
        const correoPedido = pedido.cliente?.correo || pedido.correo || "";
        const esMio = clienteActual.correo && correoPedido === clienteActual.correo;

        const numPedido = pedido.numero || pedido.numeroPedido || "PED-" + (4228 + index);
        const nombreCliente = pedido.cliente?.nombre || pedido.nombre || "Cliente";
        const telefonoCliente = pedido.cliente?.telefono || pedido.telefono || "No registrado";
        const precioTotal = pedido.precio ? `$ ${pedido.precio.toLocaleString()}` : "N/D";
        const fechaPedido = pedido.fecha || "Fecha no registrada";

        // 1. Fila principal resumida con la etiqueta "Tú" y el botón de acción
        let fila = document.createElement("tr");
        
        fila.innerHTML = `
            <td><strong>${numPedido}</strong></td>
            <td>
                ${nombreCliente} 
                ${esMio ? '<span style="background: #e1bee7; color: #4a148c; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 5px;">Tú</span>' : ''}
            </td>
            <td>${correoPedido}</td>
            <td><span class="badge bg-success">Nodo 1</span></td>
            <td>${fechaPedido}</td>
            <td>
                <button onclick="toggleDetallePedido(${index})" class="btn btn-sm" style="background: #4a148c; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Ver Detalle 👁️
                </button>
            </td>
        `;
        tablaVentas.appendChild(fila);

        // 2. Fila oculta desplegable con todo el detalle completo (estilo carrito/ticket)
        let filaDetalle = document.createElement("tr");
        filaDetalle.id = `detalle-pedido-${index}`;
        filaDetalle.style.display = "none"; // Oculto por defecto
        filaDetalle.style.backgroundColor = "#fcf9f9";
        
        filaDetalle.innerHTML = `
            <td colspan="6" style="padding: 12px;">
                <div style="border: 1px dashed #d7ccc8; padding: 12px; border-radius: 6px; background: #fff;">
                    <strong>📦 Detalle Completo de la Transacción (${numPedido})</strong>
                    <p style="margin: 5px 0 3px 0; font-size: 13px;"><strong>Teléfono de contacto:</strong> ${telefonoCliente}</p>
                    <p style="margin: 3px 0; font-size: 13px;"><strong>Productos / Detalles:</strong> ${formatearProductos(pedido.productos || pedido.producto)}</p>
                    ${pedido.colorTono ? `<p style="margin: 3px 0; font-size: 13px;"><strong>Tono seleccionado:</strong> ${pedido.colorTono}</p>` : ''}
                    <p style="margin: 3px 0 0 0; font-size: 13px;"><strong>Total pagado:</strong> ${precioTotal}</p>
                </div>
            </td>
        `;
        tablaVentas.appendChild(filaDetalle);
    });
}

// Función para mostrar u ocultar el detalle al hacer clic en el botón
function toggleDetallePedido(index) {
    const detalleFila = document.getElementById(`detalle-pedido-${index}`);
    if (detalleFila) {
        if (detalleFila.style.display === "none") {
            detalleFila.style.display = "table-row";
        } else {
            detalleFila.style.display = "none";
        }
    }
}

// Función auxiliar para mostrar los productos de forma ordenada
function formatearProductos(productos) {
    if (!productos) return "Sin productos especificados";
    if (typeof productos === "string") return productos;
    
    // Si es un arreglo de productos, los unimos por comas
    return productos.map(p => `${p.nombre || 'Producto'} (x${p.cantidad || 1})`).join(", ");

}

window.addEventListener("storage", (evento) => {
    if (evento.key === "beautydata_pedidos" || evento.key === "beautydata_evento_sincronizacion") {
        cargarYMostrarVentas();
    }
});