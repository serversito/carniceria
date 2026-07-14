document.addEventListener("DOMContentLoaded", () => {    
    if (!localStorage.getItem("inventario")) {
        localStorage.setItem("inventario", JSON.stringify(productosIniciales));
    }
    updateTabla();

    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const fotoMenu = document.getElementById("menu-foto-perfil");

    if (sesionUsuario) {
        document.querySelector(".user-text a").textContent = sesionUsuario.nombre;
        document.querySelector(".user-text span").textContent = sesionUsuario.rol;
        if (sesionUsuario.foto && fotoMenu) {
            fotoMenu.src = sesionUsuario.foto; 
        }
    }
});

function toggleMenu(){
    document.getElementById("menu-lateral").classList.toggle("activo");
    document.getElementById("overlay").classList.toggle("activo");
}

document.getElementById("overlay").addEventListener("click", function(){
    document.getElementById("menu-lateral").classList.remove("activo");
    this.classList.remove("activo");
    document.getElementById("detalle-producto").style.display = "none";
});

function toggleRegistro(){
    document.getElementById("record-producto").style.display = "flex";
}

function closeRegistro(){
    document.getElementById("record-producto").style.display = "none";
    cleanRegistro();
}

const productosIniciales = [
    {
        id: "1",
        imagen: "\\!Resource\\Images\\placeholder-1.jpg",
        nombre: "Carne de res",
        cantidad: "10 KG",
        precio: "$100",
        caducidad: "2026-07-14",
        descripcion: "corte picaña, marmoleado ligereo, primer refrigerador",
        proveedor: "Proveedor General",
        categoria: "Carne"
    },
    {
        id: "2",
        imagen: "\\!Resource\\Images\\placeholder-2.jpg",
        nombre: "Carne de pollo",
        cantidad: "4 kg",
        precio: "$80",
        caducidad: "2026-03-08",
        descripcion: "sin hueso, sin piel, tercer refrigerador",
        proveedor: "Proveedor General",
        categoria: "Carne"
    },
    {
        id: "4",
        imagen: "\\!Resource\\Images\\placeholder-4.jpg",
        nombre: "Arroz",
        cantidad: "2 u",
        precio: "$20",
        caducidad: "2026-11-02",
        descripcion: "bolsa de 500g, marca verde valle, primer estante izquierda",
        proveedor: "no especificado/independiente",
        categoria: "Despensa"
    },
    {
        id: "7",
        imagen: "\\!Resource\\Images\\placeholder-7.jpg",
        nombre: "Cebolla",
        cantidad: "2 kg",
        precio: "$30",
        caducidad: "2026-08-11",
        descripcion: "tamaño mediano, sin tallo, segundo estante derecha",
        proveedor: "no especificado/independiente",
        categoria: "Frutas y verduras"
    },
    {
        id: "5",
        imagen: "\\!Resource\\Images\\placeholder-5.jpg",
        nombre: "Salchicha",
        cantidad: "12 kg",
        precio: "$60",
        caducidad: "2026-07-21",
        descripcion: "polaca, marca chimex, primer refrigerador",
        proveedor: "no especificado/independiente",
        categoria: "Embutidos"
    }
];

function updateTabla() {
    const tabla = document.getElementById("tabla-productos");
    const productos = JSON.parse(localStorage.getItem("inventario")) || [];
    
    tabla.innerHTML = "";

    productos.forEach((prod, index) => {
        const imgSrc = prod.imagen || "\\!Resource\\Images\\placeholder-1.jpg";

        const fila = document.createElement("tr");
        fila.style.cursor = "pointer";

        fila.innerHTML = `
            <td><img src="${imgSrc}" class="imagen-producto"></td>
            <td>${prod.nombre}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.precio.startsWith('$') ? prod.precio : '$' + prod.precio}</td>
            <td>${prod.caducidad}</td>
            <td>${prod.descripcion}</td>
            <td>
                <button class="btn-borrar" title="Eliminar Producto">
                    <img src="\\!Resource\\Images\\icono-borrar.png" class="icono-borrar" alt="Borrar">
                </button>
            </td>
        `;

        fila.querySelectorAll("td:not(:last-child)").forEach(celda => {
            celda.addEventListener("click", () => {
                mostrarDetallesProducto(prod.id);
            });
        });

        fila.querySelector(".btn-borrar").addEventListener("click", (e) => {
            e.stopPropagation();
            eliminarProducto(index);
        });

        tabla.appendChild(fila);
    });
}

function mostrarDetallesProducto(idProducto) {
    const productos = JSON.parse(localStorage.getItem("inventario")) || [];
    const prod = productos.find(p => p.id === idProducto);

    if (!prod) return;

    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const esAdministrador = sesionUsuario && sesionUsuario.rol.toLowerCase() === "administrador";
    const tarjeta = document.querySelector(".detalles-card-content");
    const contenedorGuardar = document.getElementById("det-contenedor-guardar");
    const inputCat = document.getElementById("det-categoria-input");
    const selectCat = document.getElementById("det-categoria-select");

    document.getElementById("det-id-oculto").value = prod.id;
    document.getElementById("det-imagen").src = prod.imagen || "\\!Resource\\Images\\placeholder-1.jpg";
    document.getElementById("det-nombre").value = prod.nombre;
    document.getElementById("det-proveedor").value = prod.proveedor || "no especificado/independiente";
    document.getElementById("det-cantidad").value = prod.cantidad;
    document.getElementById("det-descripcion").value = prod.descripcion || "";

    let precioLimpio = prod.precio.replace('$', '').trim();
    document.getElementById("det-precio").value = esAdministrador ? precioLimpio : '$' + precioLimpio;

    if (prod.caducidad) {
        if (esAdministrador) {
            document.getElementById("det-caducidad").value = prod.caducidad;
        } else {
            const partesFecha = prod.caducidad.split("-");
            document.getElementById("det-caducidad").value = partesFecha.length === 3 ? `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}` : prod.caducidad;
        }
    } else {
        document.getElementById("det-caducidad").value = esAdministrador ? "" : "No registra";
    }

    const camposEditables = ["det-nombre", "det-proveedor", "det-cantidad", "det-precio", "det-caducidad", "det-descripcion"];

    if (esAdministrador) {
        camposEditables.forEach(id => document.getElementById(id).removeAttribute("readonly"));
        
        document.getElementById("det-caducidad").onfocus = function() { this.type = 'date'; };
        document.getElementById("det-caducidad").onblur = function() { if(!this.value) this.type = 'text'; };

        inputCat.style.display = "none";
        selectCat.style.display = "block";
        selectCat.value = prod.categoria;

        tarjeta.classList.add("modo-editor");
        contenedorGuardar.style.display = "block";
    } else {

        camposEditables.forEach(id => document.getElementById(id).setAttribute("readonly", "true"));
        document.getElementById("det-caducidad").onfocus = null;
        document.getElementById("det-caducidad").onblur = null;
        document.getElementById("det-caducidad").type = "text";

        inputCat.style.display = "block";
        selectCat.style.display = "none";
        inputCat.value = prod.categoria;
        tarjeta.classList.remove("modo-editor");
        contenedorGuardar.style.display = "none";
    }

    document.getElementById("detalle-producto").style.display = "flex";
    document.getElementById("overlay").classList.add("activo");
}

function guardarEdicionProducto() {
    const idTarget = document.getElementById("det-id-oculto").value;
    const productos = JSON.parse(localStorage.getItem("inventario")) || [];

    const index = productos.findIndex(p => p.id === idTarget);

    if (index === -1) {
        alert("Error al intentar actualizar: El producto ya no existe.");
        return;
    }

    const nombre = document.getElementById("det-nombre").value.trim();
    const proveedor = document.getElementById("det-proveedor").value.trim() || "no especificado/independiente";
    const categoria = document.getElementById("det-categoria-select").value;
    const cantidad = document.getElementById("det-cantidad").value.trim();
    const precio = document.getElementById("det-precio").value.trim();
    const caducidad = document.getElementById("det-caducidad").value;
    const descripcion = document.getElementById("det-descripcion").value;

    if (!nombre || !cantidad || !precio || !caducidad) {
        alert("Error: El Nombre, Cantidad, Precio y Fecha de caducidad no pueden guardarse vacíos.");
        return;
    }

    productos[index].nombre = nombre;
    productos[index].proveedor = proveedor;
    productos[index].categoria = categoria;
    productos[index].cantidad = cantidad;
    productos[index].precio = precio.startsWith('$') ? precio : '$' + precio;
    productos[index].caducidad = caducidad;
    productos[index].descripcion = descripcion;

    localStorage.setItem("inventario", JSON.stringify(productos));

    updateTabla();
    closeDetalle();
}

function closeDetalle() {
    document.getElementById("detalle-producto").style.display = "none";
    document.getElementById("overlay").classList.remove("activo");
}

function saveProducto(){
    const id = document.getElementById("prod-id").value.trim();
    const nombre = document.getElementById("prod-nombre").value;
    const cantidad = document.getElementById("prod-cantidad").value;
    const precio = document.getElementById("prod-precio").value;
    const caducidad = document.getElementById("prod-caducidad").value;
    let proveedor = document.getElementById("prod-proveedor").value;
    const categoria = document.getElementById("prod-categoria").value;
    const descripcion = document.getElementById("prod-descripcion").value;
 
    if(!id || !nombre || !cantidad || !precio || !caducidad || !categoria){
        alert("Completa todos los campos.");
        return;
    }

    if (proveedor === "") {
        proveedor = "no especificado/independiente";
    }

    let rutaImagen = "";
    
    if (id === "1" || isNaN(id)) {
        rutaImagen = "\\!Resource\\Images\\placeholder-1.jpg";
    } else {
        rutaImagen = `\\!Resource\\Images\\placeholder-${id}.jpg`;
    }

    const newProducto = {
        id: id,
        imagen: rutaImagen, 
        nombre: nombre,
        cantidad: cantidad,
        precio: precio,
        caducidad: caducidad,
        proveedor: proveedor,   
        categoria: categoria,   
        descripcion: descripcion
    };

    const productos = JSON.parse(localStorage.getItem("inventario")) || [];
    productos.push(newProducto);
    localStorage.setItem("inventario", JSON.stringify(productos));

    updateTabla();
    closeRegistro();
}

function cleanRegistro() {
    document.getElementById("prod-id").value = "";
    document.getElementById("prod-nombre").value = "";
    document.getElementById("prod-cantidad").value = "";
    document.getElementById("prod-precio").value = "";
    document.getElementById("prod-caducidad").value = "";
    document.getElementById("prod-proveedor").value = "";
    document.getElementById("prod-categoria").value = "";
    document.getElementById("prod-descripcion").value = "";
}

function eliminarProducto(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
        const productos = JSON.parse(localStorage.getItem("inventario")) || [];
        
        const tabla = document.getElementById("tabla-productos");
        const categoriaFiltro = tabla ? tabla.getAttribute("data-categoria") : null;
        
        let productosFiltrados = categoriaFiltro 
            ? productos.filter(prod => prod.categoria.toLowerCase() === categoriaFiltro.toLowerCase())
            : productos;

        const productoAEliminar = productosFiltrados[index];

        const nuevoArregloMaestro = productos.filter(prod => prod.id !== productoAEliminar.id);
        
        localStorage.setItem("inventario", JSON.stringify(nuevoArregloMaestro));
        
        updateTabla();
    }
}
