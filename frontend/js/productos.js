/* =====================================================
   BEAUTYDATA - CATALOGO COMPLETO Y CARRITO CON PETICIÓN POST
===================================================== */

const productos = [
    // ================= ROSTRO =================
    {
        id: 1,
        nombre: "Base Fit Me",
        marca: "Maybelline",
        categoria: "Rostro",
        precio: 48000,
        stock: 5,
        imagen: "base.png",
        descripcion: "Base líquida de acabado natural para una piel uniforme.",
        etiqueta: "MÁS VENDIDO",
        colores: [
            { nombre: "Marfil", imagen: "base marfil.jpg" },
            { nombre: "Canela Líquido", imagen: "base_canela_liquido.jpg" },
            { nombre: "Natural", imagen: "base_natural.png" }
        ]
    },
    {
        id: 2,
        nombre: "BB Cream",
        marca: "Maybelline",
        categoria: "Rostro",
        precio: 46000,
        stock: 4,
        imagen: "bb_cream_claro.jpg",
        descripcion: "Crema con color para un acabado ligero y uniforme.",
        colores: [
            { nombre: "Claro", imagen: "bb_cream_claro.jpg" },
            { nombre: "Medio", imagen: "bb_cream_medio.jpg" },
            { nombre: "Oscuro", imagen: "bb_cream_oscuro.jpg" }
        ]
    },
    {
        id: 3,
        nombre: "Rubor Compacto",
        marca: "Milani",
        categoria: "Rostro",
        precio: 42000,
        stock: 6,
        imagen: "rubor.jpg",
        descripcion: "Rubor de textura suave para dar color a tus mejillas.",
        etiqueta: "OFERTA",
        precioAnterior: 49000,
        colores: [
            { nombre: "Clásico", imagen: "rubor.jpg" },
            { nombre: "Coral", imagen: "rubor_coral.jpg" },
            { nombre: "Durazno", imagen: "rubor_durazno.jpg" },
            { nombre: "Malva", imagen: "rubor_malva.jpg" }
        ]
    },
    {
        id: 4,
        nombre: "Corrector Fit Me",
        marca: "Maybelline",
        categoria: "Rostro",
        precio: 35000,
        stock: 5,
        imagen: "tono_claro.jpg",
        descripcion: "Corrector ligero para unificar el tono de la piel.",
        colores: [
            { nombre: "Claro", imagen: "tono_claro.jpg" },
            { nombre: "Medio", imagen: "tono_medio.jpg" },
            { nombre: "Miel", imagen: "tono_miel.jpg" },
            { nombre: "Natural", imagen: "tono_natural.jpg" }
        ]
    },
    {
        id: 5,
        nombre: "Polvo Compacto",
        marca: "Vogue",
        categoria: "Rostro",
        precio: 29000,
        stock: 7,
        imagen: "porcelana.jpg",
        descripcion: "Polvo compacto para sellar y matificar el maquillaje.",
        colores: [
            { nombre: "Porcelana", imagen: "porcelana.jpg" },
            { nombre: "Beige", imagen: "polvo_compacto_beige.jpg" },
            { nombre: "Canela", imagen: "canela.jpg" },
            { nombre: "natural", imagen: "natural.jpg" }
        ]
    },
    {
        id: 6,
        nombre: "Iluminador Facial",
        marca: "Milani",
        categoria: "Rostro",
        precio: 39000,
        stock: 4,
        imagen: "champagne.jpg",
        descripcion: "Iluminador para aportar luz y brillo al rostro.",
        colores: [
            { nombre: "Champagne", imagen: "champagne.jpg" },
            { nombre: "Dorado", imagen: "dorado.jpg" },
            { nombre: "Plateado", imagen: "plateado.jpg" }
        ]
    },
    {
        id: 7,
        nombre: "Primer Facial",
        marca: "Maybelline",
        categoria: "Rostro",
        precio: 39000,
        stock: 3,
        imagen: "primer_transparente.jpg",
        descripcion: "Prepara la piel y ayuda a mejorar la aplicación del maquillaje.",
        colores: [
            { nombre: "Transparente", imagen: "primer_transparente.jpg" }
        ]
    },
    {
        id: 8,
        nombre: "Bronceador Facial",
        marca: "Milani",
        categoria: "Rostro",
        precio: 43000,
        stock: 4,
        imagen: "bronceador_natural.jpg",
        descripcion: "Aporta un efecto bronceado y cálido al rostro.",
        colores: [
            { nombre: "Natural", imagen: "bronceador_natural.jpg" },
            { nombre: "deep", imagen: "bronceador_deep.jpg" },
            { nombre: "Sunlight", imagen: "bronceador_sun_light.jpg" }
        ]
    },
    {
        id: 9,
        nombre: "Fijador de Maquillaje",
        marca: "BeautyData",
        categoria: "Rostro",
        precio: 37000,
        stock: 5,
        imagen: "fijador_maquillaje.jpg",
        descripcion: "Spray para ayudar a mantener el maquillaje en su lugar.",
        colores: [
            { nombre: "Estándar", imagen: "fijador_maquillaje.jpg" }
        ]
    },

    // ================= OJOS =================
    {
        id: 10,
        nombre: "Máscara de Pestañas",
        marca: "Maybelline",
        categoria: "Ojos",
        precio: 38000,
        stock: 6,
        imagen: "mascara_pestañas_negra.jpg",
        descripcion: "Máscara para dar volumen y definición a las pestañas.",
        etiqueta: "FAVORITO",
        colores: [
            { nombre: "Negra", imagen: "mascara_pestañas_negra.jpg" },
            { nombre: "Muy Negra", imagen: "mascara_pestañas_muy_negra.jpg" }
        ]
    },
    {
        id: 11,
        nombre: "Paleta de Sombras",
        marca: "Wet n Wild",
        categoria: "Ojos",
        precio: 45000,
        stock: 4,
        imagen: "sombras_nude.jpg",
        descripcion: "Paleta de sombras con tonos para looks de día y noche.",
        colores: [
            { nombre: "Nude", imagen: "sombras_nude.jpg" },
            { nombre: "Smokey", imagen: "sombras_smokey.jpg" },
            { nombre: "Tierra", imagen: "sombras_tierra.jpg" },
            { nombre: "Rosa", imagen: "paleta_rosa.jpg" }
        ]
    },
    {
        id: 12,
        nombre: "Delineador de Ojos",
        marca: "Vogue",
        categoria: "Ojos",
        precio: 26000,
        stock: 6,
        imagen: "delineador_negro.jpg",
        descripcion: "Delineador de precisión para definir la mirada.",
        colores: [
            { nombre: "Negro", imagen: "delineador_negro.jpg" },
            { nombre: "Café", imagen: "delineador_cafe.jpg" }
        ]
    },
    {
        id: 13,
        nombre: "Lápiz para Cejas",
        marca: "Maybelline",
        categoria: "Ojos",
        precio: 22000,
        stock: 5,
        imagen: "lapiz_cejas_cafe.jpg",
        descripcion: "Lápiz para rellenar y definir las cejas.",
        colores: [
            { nombre: "Café", imagen: "lapiz_cejas_cafe.jpg" },
            { nombre: "Café Oscuro", imagen: "lapiz_cejas__cafe_oscuro.jpg" },
            { nombre: "Rubio", imagen: "lapiz_cejas_rubio.jpg" }
        ]
    },
    {
        id: 14,
        nombre: "Gel para Cejas",
        marca: "BeautyData",
        categoria: "Ojos",
        precio: 24000,
        stock: 5,
        imagen: "gel_cejas_transparente.jpg",
        descripcion: "Gel para peinar y fijar las cejas.",
        colores: [
            { nombre: "Transparente", imagen: "gel_cejas_transparente.jpg" },
            { nombre: "Café", imagen: "gel_cejas_cafe.jpg" }
        ]
    },
    {
        id: 15,
        nombre: "Pestañas Postizas",
        marca: "Beauty Tools",
        categoria: "Ojos",
        precio: 19000,
        stock: 8,
        imagen: "pestañas_naturales.jpg",
        descripcion: "Pestañas ligeras para realzar la mirada.",
        colores: [
            { nombre: "Naturales", imagen: "pestañas_naturales.jpg" },
            { nombre: "Dramáticas", imagen: "pestañas_dramaticas.jpg" },
            { nombre: "Volumen", imagen: "pestañas_volumen.jpg" }
        ]
    },
    {
        id: 16,
        nombre: "Primer para Ojos",
        marca: "BeautyData",
        categoria: "Ojos",
        precio: 28000,
        stock: 4,
        imagen: "primer_ojos_transparente.jpg",
        descripcion: "Prebase para preparar los párpados antes de las sombras.",
        colores: [
            { nombre: "Transparente", imagen: "primer_ojos_transparente.jpg" }
        ]
    },

    // ================= LABIOS =================
    {
        id: 17,
        nombre: "Brillo Labial",
        marca: "NYX",
        categoria: "Labios",
        precio: 32000,
        stock: 6,
        imagen: "brillo_rosa.jpg",
        descripcion: "Brillo labial para unos labios luminosos.",
        colores: [
            { nombre: "Rosa", imagen: "brillo_rosa.jpg" },
            { nombre: "Coral", imagen: "brillo_coral.png" },
            { nombre: "Nude", imagen: "brillo_nude.jpg" },
            { nombre: "Transparente", imagen: "brillo_transparente.jpg" }
        ]
    },
    {
        id: 18,
        nombre: "Labial Cremoso",
        marca: "NYX",
        categoria: "Labios",
        precio: 36000,
        stock: 5,
        imagen: "labial_rojo.png",
        descripcion: "Labial de acabado mate con color intenso.",
        colores: [
            { nombre: "Rojo", imagen: "labial_cremoso_rojo.png" },
            { nombre: "Rosa", imagen: "labial_cremoso_rosa.jpg" },
            { nombre: "Malva", imagen: "labial_cremoso_malva.png" },
            { nombre: "Coral", imagen: "labial_cremoso_coral.jpg" }
        ]
    },
    {
        id: 19,
        nombre: "Labial Líquido Mate",
        marca: "Maybelline",
        categoria: "Labios",
        precio: 33000,
        stock: 5,
        imagen: "labial_liquido_rojo.jpg",
        descripcion: "Color líquido de acabado mate.",
        colores: [
            { nombre: "terracota", imagen: "labial_liquido_matte_terracota.jpg" },
            { nombre: "Nude", imagen: "labial_liquido_matte_nude.jpg" },
            { nombre: "vino", imagen: "labial_liquido_matte_vino.jpg" }
        ]
    },
    {
        id: 20,
        nombre: "Delineador de Labios",
        marca: "NYX",
        categoria: "Labios",
        precio: 18000,
        stock: 7,
        imagen: "delineador_labios_nude.jpg",
        descripcion: "Lápiz para definir el contorno de los labios.",
        colores: [
            { nombre: "nude", imagen: "delineador_labios_nude.jpg" },
            { nombre: "Café", imagen: "delineador_labios_cafe.png" },
            { nombre: "Rosa", imagen: "delineador_labios_rosa.jpg" },
            { nombre: "Rojo", imagen: "delineador_labios_rojo.jpg" }
        ]
    },
    {
        id: 21,
        nombre: "Tinta Labial",
        marca: "BeautyData",
        categoria: "Labios",
        precio: 29000,
        stock: 4,
        imagen: "tinta_labial_frambuesa.jpg",
        descripcion: "Tinta ligera para aportar color a los labios.",
        colores: [
            { nombre: "Frambuesa", imagen: "tinta_labial_frambuesa.jpg" },
            { nombre: "Durazno", imagen: "tinta_labial_durazno.jpg" },
            { nombre: "Cereza", imagen: "tintal_labial_cereza.jpg" }
        ]
    },
    {
        id: 22,
        nombre: "Bálsamo Labial",
        marca: "Nivea",
        categoria: "Labios",
        precio: 16000,
        stock: 8,
        imagen: "balsamo_labial_natural.jpg",
        descripcion: "Bálsamo para hidratar y proteger los labios.",
        colores: [
            { nombre: "Natural", imagen: "balsam_labial_natural.jpg" },
            { nombre: "Rosa", imagen: "balsamo_labial_rosa.jpg" }
        ]
    },

    // ================= CUIDADO FACIAL =================
    {
        id: 23,
        nombre: "Crema Hidratante",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 52000,
        stock: 4,
        imagen: "crema_hidratante.jpg",
        descripcion: "Crema para complementar tu rutina de hidratación.",
        colores: [{ nombre: "Presentación única", imagen: "crema_hidratante.jpg" }]
    },
    {
        id: 24,
        nombre: "Limpiador Facial",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 44000,
        stock: 5,
        imagen: "limpiador_facial.png",
        descripcion: "Limpiador facial para la rutina diaria.",
        colores: [{ nombre: "Presentación única", imagen: "limpiador_facial.png" }]
    },
    {
        id: 25,
        nombre: "Sérum Facial",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 55000,
        stock: 3,
        imagen: "serum_facial.jpg",
        descripcion: "Sérum para complementar el cuidado de la piel.",
        colores: [{ nombre: "Presentación única", imagen: "serum_facial.jpg" }]
    },
    {
        id: 26,
        nombre: "Tónico Facial",
        marca: "Garnier",
        categoria: "Cuidado facial",
        precio: 32000,
        stock: 5,
        imagen: "tonico_facial.jpg",
        descripcion: "Tónico para completar la limpieza facial.",
        colores: [{ nombre: "Presentación única", imagen: "tonico_facial.jpg" }]
    },
    {
        id: 27,
        nombre: "Protector Solar Facial",
        marca: "Nivea",
        categoria: "Cuidado facial",
        precio: 58000,
        stock: 4,
        imagen: "protector_social_facial.jpg",
        descripcion: "Protector solar para el cuidado diario del rostro.",
        colores: [{ nombre: "Presentación única", imagen: "protector_social_facial.jpg" }]
    },
    {
        id: 28,
        nombre: "Agua Micelar",
        marca: "Garnier",
        categoria: "Cuidado facial",
        precio: 35000,
        stock: 6,
        imagen: "agua_micelar.jpg",
        descripcion: "Agua micelar para retirar impurezas y maquillaje.",
        colores: [{ nombre: "Presentación única", imagen: "agua_micelar.jpg" }]
    },
    {
        id: 29,
        nombre: "Exfoliante Facial",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 38000,
        stock: 4,
        imagen: "exfoliante_facial.jpg",
        descripcion: "Exfoliante para complementar la rutina de limpieza.",
        colores: [{ nombre: "Presentación única", imagen: "exfoliante_facial.jpg" }]
    },
    {
        id: 30,
        nombre: "Mascarilla Facial",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 25000,
        stock: 7,
        imagen: "mascarilla_facial_hidratante.jpg",
        descripcion: "Mascarilla para un momento de cuidado personal.",
        colores: [
            { nombre: "Hidratante", imagen: "mascarilla_facial_hidratante.jpg" },
            { nombre: "Nutritiva", imagen: "mascarilla_facial_nutritiva.jpg" },
            { nombre: "Purificante", imagen: "mascarilla_facial_purificante.jpg" }
        ]
    },
    {
        id: 31,
        nombre: "Contorno de Ojos",
        marca: "Cuidado Beauty",
        categoria: "Cuidado facial",
        precio: 49000,
        stock: 3,
        imagen: "contorno_ojos.jpg",
        descripcion: "Producto para complementar el cuidado del contorno de ojos.",
        colores: [{ nombre: "Presentación única", imagen: "contorno_ojos.jpg" }]
    },

    // ================= ACCESORIOS =================
    {
        id: 32,
        nombre: "Set de Brochas",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 59000,
        stock: 3,
        imagen: "brochas_rosa.jpg",
        descripcion: "Set de brochas para aplicar diferentes productos.",
        etiqueta: "OFERTA",
        precioAnterior: 65000,
        colores: [
            { nombre: "Rosa", imagen: "brochas_rosa.jpg" },
            { nombre: "Beige", imagen: "brochas_beige.jpg" },
            { nombre: "Negra", imagen: "brochas_negra.png" }
        ]
    },
    {
        id: 33,
        nombre: "Esponja de Maquillaje",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 15000,
        stock: 8,
        imagen: "esponja_rosa.jpg",
        descripcion: "Esponja suave para aplicar base y corrector.",
        colores: [
            { nombre: "Rosa", imagen: "esponja_rosa.jpg" },
            { nombre: "Beige", imagen: "esponja_beige.jpg" },
            { nombre: "Morado", imagen: "esponja_morado.jpg" }
        ]
    },
    {
        id: 34,
        nombre: "Espejo LED",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 65000,
        stock: 2,
        imagen: "espejo_led_blanco.jpg",
        descripcion: "Espejo con iluminación para tu rutina de maquillaje.",
        colores: [
            { nombre: "Blanco", imagen: "espejo_led_blanco.jpg" },
            { nombre: "Rosa", imagen: "espejo_led_rosa.jpg" }
        ]
    },
    {
        id: 35,
        nombre: "Cosmetiquera",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 39000,
        stock: 5,
        imagen: "cosmetiquera_rosa.jpg",
        descripcion: "Estuche para organizar y transportar tus cosméticos.",
        colores: [
            { nombre: "Rosa", imagen: "cosmetiquera_rosa.jpg" },
            { nombre: "Beige", imagen: "cosmetiquera_beige.jpg" },
            { nombre: "Negra", imagen: "cosmetiquera_negra.jpg" }
        ]
    },
    {
        id: 36,
        nombre: "Limpiador de Brochas",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 24000,
        stock: 4,
        imagen: "limpiador_brocha_rosa.jpg",
        descripcion: "Accesorio para facilitar la limpieza de tus brochas.",
        colores: [
            { nombre: "Rosa", imagen: "limpiador_brocha_rosa.jpg" },
            { nombre: "Blanco", imagen: "limpiador_brocha_blanco.jpg" }
        ]
    },
    {
        id: 37,
        nombre: "Pinzas para Cejas",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 12000,
        stock: 6,
        imagen: "pinzas_cejas_plateado.jpg",
        descripcion: "Pinzas de precisión para el arreglo de las cejas.",
        colores: [
            { nombre: "Plateado", imagen: "pinzas_cejas_plateado.jpg" },
            { nombre: "Dorado", imagen: "pinzas_cejas_dorado.jpg" }
        ]
    },
    {
        id: 38,
        nombre: "Organizador de Maquillaje",
        marca: "Beauty Tools",
        categoria: "Accesorios",
        precio: 48000,
        stock: 3,
        imagen: "organizaodr_maquillaje_transparente.jpg",
        descripcion: "Organizador para mantener tus productos en orden.",
        colores: [
            { nombre: "Transparente", imagen: "organizaodr_maquillaje_transparente.jpg" },
            { nombre: "Rosa", imagen: "organizaodr_maquillaje_rosa.jpg" }
        ]
    }
];


/* =====================================================
   CONFIGURACION Y DATOS + STOCK LIMITADO
===================================================== */

const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

let favoritos = JSON.parse(localStorage.getItem("beautydata_favoritos")) || [];
let categoriaActual = "Todos";
let productoTemporalParaAgregar = null;

function cargarStockGuardado() {
    const guardado = JSON.parse(localStorage.getItem("beautydata_stock") || "null");
    if (guardado && typeof guardado === "object") {
        productos.forEach(prod => {
            if (typeof guardado[prod.id] === "number") {
                prod.stock = Math.max(0, guardado[prod.id]);
            }
        });
    } else {
        guardarStock();
    }
}

function guardarStock() {
    const mapaStock = {};
    productos.forEach(prod => {
        mapaStock[prod.id] = Math.max(0, Number(prod.stock) || 0);
    });
    localStorage.setItem("beautydata_stock", JSON.stringify(mapaStock));
}

function obtenerStockProducto(id) {
    const prod = productos.find(item => item.id === Number(id));
    return prod ? Math.max(0, Number(prod.stock) || 0) : 0;
}

cargarStockGuardado();

const contenedorProductos = document.getElementById("contenedorProductos");
const buscarProducto = document.getElementById("buscarProducto");
const sinResultados = document.getElementById("sinResultados");

const panelCarrito = document.getElementById("panelCarrito");
const overlayCarrito = document.getElementById("overlayCarrito");
const itemsCarrito = document.getElementById("itemsCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const subtotalCarrito = document.getElementById("subtotalCarrito");
const btnAbrirCarrito = document.getElementById("abrirCarrito");
const btnCerrarCarrito = document.getElementById("cerrarCarrito");

const modalConfirmacion = document.getElementById("modalConfirmacion");


/* =====================================================
   APERTURA Y CIERRE DEL PANEL DEL CARRITO
===================================================== */

if (btnAbrirCarrito) {
    btnAbrirCarrito.addEventListener("click", () => {
        if (panelCarrito) panelCarrito.classList.add("abierto");
        if (overlayCarrito) overlayCarrito.classList.add("visible");
        renderizarCarritoLocal();
    });
}

if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener("click", () => {
        if (panelCarrito) panelCarrito.classList.remove("abierto");
        if (overlayCarrito) overlayCarrito.classList.remove("visible");
    });
}

if (overlayCarrito) {
    overlayCarrito.addEventListener("click", () => {
        if (panelCarrito) panelCarrito.classList.remove("abierto");
        if (overlayCarrito) overlayCarrito.classList.remove("visible");
    });
}


/* =====================================================
   MOSTRAR PRODUCTOS
===================================================== */

function renderizarProductos(lista = productos) {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        if (sinResultados) sinResultados.style.display = "block";
        return;
    }

    if (sinResultados) sinResultados.style.display = "none";

    lista.forEach(producto => {
        const esFavorito = favoritos.includes(producto.id);
        const disponible = obtenerStockProducto(producto.id);
        const agotado = disponible <= 0;

        const opcionesColores = producto.colores.map(color => {
            const nombre = typeof color === "string" ? color : color.nombre;
            const imagen = typeof color === "string" ? "" : color.imagen;

            return `
                <option value="${nombre}" data-imagen="${imagen}">
                    ${nombre}
                </option>
            `;
        }).join("");

        const etiqueta = producto.etiqueta
            ? `<span class="producto-etiqueta">${producto.etiqueta}</span>`
            : "";

        const precioAnterior = producto.precioAnterior
            ? `<del>${formatoCOP.format(producto.precioAnterior)}</del>`
            : "";

        const textoStock = agotado
            ? `<span style="display: inline-block; margin-bottom: 8px; padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background: #fde8e8; color: #b42318;">Agotado (0 disponibles)</span>`
            : `<span style="display: inline-block; margin-bottom: 8px; padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background: #f3ecec; color: #5a2d3c;">Disponibles: ${disponible}</span>`;

        const tarjeta = document.createElement("article");
        tarjeta.className = "producto-card";

        tarjeta.innerHTML = `
            ${etiqueta}

            <button
                class="btn-favorito ${esFavorito ? "seleccionado" : ""}"
                data-favorito="${producto.id}"
                title="Agregar a favoritos"
                aria-label="Agregar a favoritos"
            >
                ${esFavorito ? "♥" : "♡"}
            </button>

            <div class="producto-imagen">
                <img
                    src="img/${producto.imagen}"
                    alt="${producto.nombre}"
                    loading="lazy"
                    onerror="this.src='img/base.png';"
                >
            </div>

            <div class="producto-info">
                <span class="producto-categoria">
                    ${producto.categoria} · ${producto.marca}
                </span>

                <h3>${producto.nombre}</h3>

                <p class="producto-descripcion">
                    ${producto.descripcion}
                </p>

                <div class="producto-precio">
                    ${formatoCOP.format(producto.precio)}
                    ${precioAnterior}
                </div>

                ${textoStock}

                <label class="selector-color-label">
                    Tono / Color
                </label>

                <select
                    class="selector-color"
                    data-color="${producto.id}"
                    aria-label="Seleccionar tono o color"
                    ${agotado ? "disabled" : ""}
                >
                    ${opcionesColores}
                </select>

                <button
                    class="btn-agregar"
                    data-agregar="${producto.id}"
                    ${agotado ? "disabled style='opacity: 0.55; cursor: not-allowed;'" : ""}
                >
                    ${agotado ? "AGOTADO" : "+ AGREGAR AL CARRITO"}
                </button>
            </div>
        `;

        contenedorProductos.appendChild(tarjeta);
    });
}


/* =====================================================
   CAMBIAR IMAGEN SEGUN EL TONO SELECCIONADO
===================================================== */

if (contenedorProductos) {
    contenedorProductos.addEventListener("change", evento => {
        if (!evento.target.classList.contains("selector-color")) {
            return;
        }

        const selector = evento.target;
        const tarjeta = selector.closest(".producto-card");
        const imagen = tarjeta.querySelector(".producto-imagen img");
        const opcion = selector.selectedOptions[0];
        const nuevaImagen = opcion.dataset.imagen;

        if (nuevaImagen) {
            imagen.src = "img/" + nuevaImagen;
        }
    });
}


/* =====================================================
   FILTROS POR CATEGORIA
===================================================== */

document.querySelectorAll(".filtro").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(item => {
            item.classList.remove("activo");
        });

        boton.classList.add("activo");
        categoriaActual = boton.dataset.categoria;

        filtrarProductos();
    });
});


/* =====================================================
   BUSCADOR
===================================================== */

function filtrarProductos() {
    if (!buscarProducto) return;
    const texto = buscarProducto.value.toLowerCase().trim();

    const resultados = productos.filter(producto => {
        const coincideCategoria =
            categoriaActual === "Todos" ||
            producto.categoria === categoriaActual;

        const coincideTexto =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.marca.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto);

        return coincideCategoria && coincideTexto;
    });

    renderizarProductos(resultados);
}

if (buscarProducto) {
    buscarProducto.addEventListener("input", () => {
        filtrarProductos();
    });
}


/* =====================================================
   FAVORITOS Y AGREGAR AL CARRITO
===================================================== */

if (contenedorProductos) {
    contenedorProductos.addEventListener("click", evento => {
        const botonFavorito = evento.target.closest("[data-favorito]");
        const botonAgregar = evento.target.closest("[data-agregar]");

        if (botonFavorito) {
            const id = Number(botonFavorito.dataset.favorito);

            if (favoritos.includes(id)) {
                favoritos = favoritos.filter(item => item !== id);
            } else {
                favoritos.push(id);
            }

            localStorage.setItem(
                "beautydata_favoritos",
                JSON.stringify(favoritos)
            );

            filtrarProductos();
        }

        if (botonAgregar) {
            const id = Number(botonAgregar.dataset.agregar);
            const producto = productos.find(item => item.id === id);
            if (!producto) return;

            if (obtenerStockProducto(id) <= 0) {
                alert(`Lo sentimos, "${producto.nombre}" está agotado.`);
                filtrarProductos();
                return;
            }

            const tarjeta = botonAgregar.closest(".producto-card");
            const selector = tarjeta.querySelector(".selector-color");
            const color = selector.value;
            const imgSeleccionada = selector.selectedOptions[0].dataset.imagen;

            productoTemporalParaAgregar = { 
                ...producto,
                tono: color, 
                cantidad: 1,
                imagenTono: imgSeleccionada || producto.imagen 
            };
            abrirModalDatosCliente();
        }
    });
}


/* =====================================================
   MODAL DE CAPTURA DE DATOS
===================================================== */

function abrirModalDatosCliente() {
    if (!modalConfirmacion) {
        confirmarDatosYAgregar();
        return;
    }

    const seccionPrevio = document.getElementById("seccionClientePrevio");
    const textoPrevio = document.getElementById("textoClientePrevio");
    const inputNombre = document.getElementById("nombreCliente");
    const inputCorreo = document.getElementById("correoCliente");
    const inputTelefono = document.getElementById("telefonoCliente");

    const ultimoCliente = JSON.parse(localStorage.getItem("beautydata_ultimo_cliente"));

    if (ultimoCliente && ultimoCliente.nombre) {
        if (seccionPrevio) seccionPrevio.style.display = "block";
        if (textoPrevio) textoPrevio.textContent = `Hola de nuevo, ¿eres ${ultimoCliente.nombre}?`;
        
        if (inputNombre) inputNombre.value = ultimoCliente.nombre;
        if (inputCorreo) inputCorreo.value = ultimoCliente.correo;
        if (inputTelefono) inputTelefono.value = ultimoCliente.telefono;
    } else {
        if (seccionPrevio) seccionPrevio.style.display = "none";
        if (inputNombre) inputNombre.value = "";
        if (inputCorreo) inputCorreo.value = "";
        if (inputTelefono) inputTelefono.value = "";
    }

    modalConfirmacion.classList.add("visible");
}

const btnSoyElMismo = document.getElementById("btnSoyElMismo");
if (btnSoyElMismo) {
    btnSoyElMismo.addEventListener("click", () => {
        confirmarDatosYAgregar();
    });
}

const btnSoyOtro = document.getElementById("btnSoyOtro");
if (btnSoyOtro) {
    btnSoyOtro.addEventListener("click", () => {
        const seccionPrevio = document.getElementById("seccionClientePrevio");
        const inputNombre = document.getElementById("nombreCliente");
        const inputCorreo = document.getElementById("correoCliente");
        const inputTelefono = document.getElementById("telefonoCliente");

        if (seccionPrevio) seccionPrevio.style.display = "none";
        if (inputNombre) inputNombre.value = "";
        if (inputCorreo) inputCorreo.value = "";
        if (inputTelefono) inputTelefono.value = "";
        if (inputNombre) inputNombre.focus();
    });
}

const btnCancelarCompra = document.getElementById("cancelarCompra");
const btnConfirmarCompra = document.getElementById("confirmarCompra");

if (btnCancelarCompra) {
    btnCancelarCompra.addEventListener("click", () => {
        if (modalConfirmacion) modalConfirmacion.classList.remove("visible");
        productoTemporalParaAgregar = null;
    });
}

if (btnConfirmarCompra) {
    btnConfirmarCompra.addEventListener("click", () => {
        confirmarDatosYAgregar();
    });
}


/* =====================================================
   CONFIRMACIÓN, LOCALSTORAGE Y PETICIÓN POST A NETWORK
===================================================== */

async function confirmarDatosYAgregar() {
    if (modalConfirmacion) {
        modalConfirmacion.classList.remove("visible");
    }

    const temp = productoTemporalParaAgregar || { id: Date.now(), nombre: "Producto", precio: 15000, cantidad: 1 };
    const cantidadSolicitada = Number(temp.cantidad) || 1;
    const productoCatalogo = productos.find(p => p.id === Number(temp.id));

    if (productoCatalogo) {
        if (productoCatalogo.stock < cantidadSolicitada) {
            alert(`Solo quedan ${productoCatalogo.stock} unidades disponibles de "${productoCatalogo.nombre}".`);
            productoTemporalParaAgregar = null;
            filtrarProductos();
            return;
        }
        productoCatalogo.stock -= cantidadSolicitada;
        guardarStock();
        filtrarProductos();
    }

    const inputNombre = document.getElementById("nombreCliente");
    const inputCorreo = document.getElementById("correoCliente");
    const inputTelefono = document.getElementById("telefonoCliente");

    const nombre = (inputNombre && inputNombre.value.trim()) ? inputNombre.value.trim() : "Karol Nataly Erira";
    const correo = (inputCorreo && inputCorreo.value.trim()) ? inputCorreo.value.trim() : "karolnataly52@gmail.com";
    const telefono = (inputTelefono && inputTelefono.value.trim()) ? inputTelefono.value.trim() : "2113055548";

    const clienteData = { nombre, correo, telefono };
    localStorage.setItem("beautydata_ultimo_cliente", JSON.stringify(clienteData));

    const idVenta = `VTA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const datosEnvio = {
        ...temp,
        idVenta,
        cantidad: cantidadSolicitada,
        cliente: clienteData,
        fecha: new Date().toISOString()
    };

    productoTemporalParaAgregar = null;

    let carritoLocal = JSON.parse(localStorage.getItem("beautydata_carrito_local")) || [];
    carritoLocal.push(datosEnvio);
    localStorage.setItem("beautydata_carrito_local", JSON.stringify(carritoLocal));

    let pedidosExistentes = JSON.parse(localStorage.getItem("beautydata_pedidos")) || [];
    pedidosExistentes.push(datosEnvio);
    localStorage.setItem("beautydata_pedidos", JSON.stringify(pedidosExistentes));

    renderizarCarritoLocal();

    try {
        await fetch('http://localhost:3000/api/carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEnvio)
        });

        const respVenta = await fetch('http://localhost:3000/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idVenta,
                nombre,
                correo,
                telefono
            })
        });
        const dataVenta = await respVenta.json();
        console.log("[DEBUG] Respuesta /api/ventas:", dataVenta);
    } catch (error) {
        console.log("Error de red al conectar con el servidor", error);
    }
}


/* =====================================================
   MOSTRAR NOMBRE DE LA PROPIETARIA EN CADA ÍTEM DEL CARRITO
===================================================== */

function obtenerNombrePropietariaItem(item) {
    if (item && item.cliente) {
        if (typeof item.cliente === "string" && item.cliente.trim()) {
            return item.cliente.trim();
        }
        if (typeof item.cliente === "object" && item.cliente.nombre && item.cliente.nombre.trim()) {
            return item.cliente.nombre.trim();
        }
    }
    const ultimo = JSON.parse(localStorage.getItem("beautydata_ultimo_cliente") || "null");
    return (ultimo && ultimo.nombre) ? ultimo.nombre : "Sin asignar";
}

function renderizarCarritoLocal() {
    if (!itemsCarrito) return;

    const carritoLocal = JSON.parse(localStorage.getItem("beautydata_carrito_local")) || [];

    if (contadorCarrito) {
        const totalCantidad = carritoLocal.reduce((acc, item) => acc + (Number(item.cantidad) || 1), 0);
        contadorCarrito.textContent = totalCantidad;
    }

    if (carritoLocal.length === 0) {
        itemsCarrito.innerHTML = `<p style="padding: 16px; text-align: center;">Tu carrito está vacío.</p>`;
        if (subtotalCarrito) subtotalCarrito.textContent = formatoCOP.format(0);
        return;
    }

    let sumaTotal = 0;

    itemsCarrito.innerHTML = carritoLocal.map((item, index) => {
        const cantidad = Number(item.cantidad) || 1;
        const precioUnitario = Number(item.precio) || 0;
        sumaTotal += precioUnitario * cantidad;

        const propietaria = obtenerNombrePropietariaItem(item);
        const imgSrc = item.imagenTono ? `img/${item.imagenTono}` : `img/${item.imagen || "base.png"}`;

        return `
            <div class="carrito-item" data-index="${index}" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 0; border-bottom: 1px solid #eee;">
                <img
                    src="${imgSrc}"
                    alt="${item.nombre}"
                    onerror="this.src='img/base.png';"
                    style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px;"
                >
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${item.nombre}</div>
                    <div style="font-size: 0.85rem; color: #555;">
                        Tono: ${item.tono || "Estándar"} · ${formatoCOP.format(precioUnitario)} x ${cantidad}
                    </div>
                    <div style="font-size: 0.82rem; color: #6e3b4e; margin-top: 2px;">
                        Propietaria: <strong>${propietaria}</strong>
                    </div>
                </div>
                <button
                    type="button"
                    class="btn-eliminar-carrito"
                    data-eliminar-carrito="${index}"
                    title="Eliminar producto"
                    aria-label="Eliminar producto"
                    style="background: none; border: none; cursor: pointer; font-size: 1rem;"
                >
                    🗑️
                </button>
            </div>
        `;
    }).join("");

    if (subtotalCarrito) {
        subtotalCarrito.textContent = formatoCOP.format(sumaTotal);
    }
}

if (itemsCarrito) {
    itemsCarrito.addEventListener("click", async (evento) => {
        const btnEliminar = evento.target.closest("[data-eliminar-carrito]");
        if (!btnEliminar) return;

        const idx = Number(btnEliminar.dataset.eliminarCarrito);
        let carritoLocal = JSON.parse(localStorage.getItem("beautydata_carrito_local")) || [];
        const eliminado = carritoLocal[idx];
        if (!eliminado) return;

        // 1. Quitar del carrito local
        carritoLocal.splice(idx, 1);
        localStorage.setItem("beautydata_carrito_local", JSON.stringify(carritoLocal));

        // 2. Devolver stock en productos y localStorage
        const prodCatalogo = productos.find(p => p.id === Number(eliminado.id));
        if (prodCatalogo) {
            prodCatalogo.stock = (Number(prodCatalogo.stock) || 0) + (Number(eliminado.cantidad) || 1);
            guardarStock();
            filtrarProductos();
        }

        // 3. Quitar de beautydata_pedidos para que desaparezca en Ventas y Clientes
        let pedidosActuales = JSON.parse(localStorage.getItem("beautydata_pedidos")) || [];
        let borradoPedido = false;
        pedidosActuales = pedidosActuales.filter(p => {
            if (borradoPedido) return true;

            const mismoIdVenta = eliminado.idVenta && p.idVenta && String(p.idVenta) === String(eliminado.idVenta);
            const mismoProducto = String(p.nombre || p.producto || "").toLowerCase() === String(eliminado.nombre || "").toLowerCase();
            const mismaFecha = !eliminado.fecha || !p.fecha || String(p.fecha) === String(eliminado.fecha);

            if (mismoIdVenta || (mismoProducto && mismaFecha)) {
                borradoPedido = true;
                return false;
            }
            return true;
        });
        localStorage.setItem("beautydata_pedidos", JSON.stringify(pedidosActuales));

        // 4. Avisar al servidor para borrar en los nodos CSV
        const nombreClienteEliminado =
            (typeof eliminado.cliente === "object" ? eliminado.cliente?.nombre : eliminado.cliente) || "";

        try {
            await fetch(`/api/ventas/${encodeURIComponent(eliminado.idVenta || eliminado.nombre || "pedido")}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idVenta: eliminado.idVenta || "",
                    cliente: nombreClienteEliminado,
                    producto: eliminado.nombre || ""
                })
            });
        } catch (err) {
            console.warn("No se pudo sincronizar con el servidor:", err);
        }

        // 5. Notificar a Ventas y Clientes
        localStorage.setItem("beautydata_evento_sincronizacion", JSON.stringify({
            tipo: "VENTA_ELIMINADA",
            idVenta: eliminado.idVenta || "",
            idProducto: eliminado.id,
            producto: eliminado.nombre || "",
            cliente: nombreClienteEliminado,
            cantidad: Number(eliminado.cantidad) || 1,
            timestamp: Date.now()
        }));

        renderizarCarritoLocal();
    });
}

function sincronizarCarritoTrasEliminarVenta(payload) {
    if (!payload || payload.tipo !== "VENTA_ELIMINADA") return;

    cargarStockGuardado();

    let carritoLocal = JSON.parse(localStorage.getItem("beautydata_carrito_local")) || [];
    const eliminados = [];
    const conservados = [];

    for (const item of carritoLocal) {
        const coincideIdVenta = payload.idVenta && item.idVenta && String(item.idVenta) === String(payload.idVenta);
        const coincideProducto = !payload.idVenta && payload.producto &&
            String(item.nombre || "").toLowerCase() === String(payload.producto).toLowerCase();

        if (coincideIdVenta || coincideProducto) {
            eliminados.push(item);
        } else {
            conservados.push(item);
        }
    }

    if (eliminados.length > 0) {
        localStorage.setItem("beautydata_carrito_local", JSON.stringify(conservados));
        eliminados.forEach(item => {
            const prodCatalogo = productos.find(p => p.id === Number(item.id));
            if (prodCatalogo) {
                prodCatalogo.stock = (Number(prodCatalogo.stock) || 0) + (Number(item.cantidad) || 1);
            }
        });
        guardarStock();
    }

    filtrarProductos();
    renderizarCarritoLocal();
}

window.addEventListener("storage", (evento) => {
    if (evento.key === "beautydata_evento_sincronizacion" && evento.newValue) {
        try {
            sincronizarCarritoTrasEliminarVenta(JSON.parse(evento.newValue));
        } catch (e) {
            console.error("Error sincronizando carrito:", e);
        }
    } else if (evento.key === "beautydata_stock" || evento.key === "beautydata_carrito_local") {
        cargarStockGuardado();
        filtrarProductos();
        renderizarCarritoLocal();
    }
});

window.addEventListener("focus", () => {
    cargarStockGuardado();
    filtrarProductos();
    renderizarCarritoLocal();
});

document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(productos);
    renderizarCarritoLocal();
    const ultimoEvento = JSON.parse(localStorage.getItem("beautydata_evento_sincronizacion") || "null");
    if (ultimoEvento && Date.now() - Number(ultimoEvento.timestamp || 0) < 4000) {
        sincronizarCarritoTrasEliminarVenta(ultimoEvento);
    }
});