const PALETA_AVATARES = [
  "#54283f", // vino BeautyData
  "#8c3b5d", // frambuesa
  "#bd925d", // dorado suave
  "#6e4768", // ciruela
  "#9e5a63", // rosa antiguo
  "#473854"  // berenjena
];

function obtenerInicialCliente(nombre) {
  const limpio = String(nombre || "").trim();
  return limpio ? limpio.charAt(0).toUpperCase() : "?";
}

function obtenerColorAvatar(texto) {
  const base = String(texto || "BeautyData");
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = base.charCodeAt(i) + ((hash << 5) - hash);
  }
  const indice = Math.abs(hash) % PALETA_AVATARES.length;
  return PALETA_AVATARES[indice];
}

function renderizarPerfilesClientes(listaClientes, contenedorId = "contenedorClientes") {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.classList.add("clientes-grid");

  if (!Array.isArray(listaClientes) || listaClientes.length === 0) {
    contenedor.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 36px; background: #fff; border-radius: 14px; color: #8c7a84;">
        Aún no hay perfiles de clientes registrados.
      </div>
    `;
    return;
  }

  contenedor.innerHTML = listaClientes.map((cli) => {
    const nombre = cli.nombre || "Cliente BeautyData";
    const inicial = obtenerInicialCliente(nombre);
    const colorFondo = obtenerColorAvatar(nombre);
    const correo = cli.correo || "Sin correo registrado";
    const telefono = cli.telefono || cli.documento || "Sin contacto";
    const compras = Number(cli.comprasRealizadas || 1);
    const nodo = cli.nodoAsignado || "nodo1";

    return `
      <article class="cliente-perfil-card">
        <div class="cliente-perfil-header">
          <div class="cliente-avatar-inicial" style="background: ${colorFondo};" aria-hidden="true">
            ${inicial}
          </div>
          <div>
            <h3 class="cliente-perfil-nombre">${nombre}</h3>
            <span class="cliente-perfil-badge">Perfil Cliente · ${nodo}</span>
          </div>
        </div>

        <div class="cliente-perfil-datos">
          <div><strong>Correo:</strong> ${correo}</div>
          <div><strong>Contacto / Doc:</strong> ${telefono}</div>
        </div>

        <div class="cliente-perfil-footer">
          <span>Compras: ${compras}</span>
          <span>${cli.ultimaCompra || "Activa"}</span>
        </div>
      </article>
    `;
  }).join("");
}

async function cargarPerfilesClientes() {
  let clientes = [];
  try {
    const resp = await fetch("/api/clientes");
    if (resp.ok) {
      const data = await resp.json();
      clientes = Array.isArray(data) ? data : (data.clientes || []);
    }
  } catch (e) {
    console.warn("Cargando clientes desde respaldo local:", e);
  }

  if (clientes.length === 0) {
    const pedidos = JSON.parse(localStorage.getItem("beautydata_pedidos") || "[]");
    const mapa = new Map();
    pedidos.forEach((p) => {
      const nombre = p.cliente?.nombre || p.nombre;
      if (nombre && !mapa.has(nombre.toLowerCase())) {
        mapa.set(nombre.toLowerCase(), {
          nombre,
          correo: p.cliente?.correo || p.correo || "",
          telefono: p.cliente?.telefono || p.telefono || "",
          comprasRealizadas: 1,
          nodoAsignado: p.nodo || "nodo1"
        });
      }
    });
    clientes = Array.from(mapa.values());
  }

  renderizarPerfilesClientes(clientes);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPerfilesClientes();
});