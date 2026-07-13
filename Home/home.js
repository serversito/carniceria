document.addEventListener("DOMContentLoaded", () => {    
    if (!localStorage.getItem("inventario")) {
        localStorage.setItem("inventario", JSON.stringify(productosIniciales));
    }
    updateTabla();

    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (sesionUsuario) {
        document.querySelector(".user-text a").textContent = sesionUsuario.nombre;
        document.querySelector(".user-text span").textContent = sesionUsuario.rol;
    }
});

function toggleMenu(){
    document.getElementById("menu-lateral").classList.toggle("activo");
    document.getElementById("overlay").classList.toggle("activo");
}

document.getElementById("overlay").addEventListener("click", function(){
    document.getElementById("menu-lateral").classList.remove("activo");
    this.classList.remove("activo");
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
        
        tabla.innerHTML += `
            <tr>
                <td><img src="${imgSrc}" class="imagen-producto"></td>
                <td>${prod.nombre}</td>
                <td>${prod.cantidad}</td>
                <td>${prod.precio.startsWith('$') ? prod.precio : '$' + prod.precio}</td>
                <td>${prod.caducidad}</td>
                <td>${prod.descripcion}</td>
                <td>
                    <button class="btn-borrar" onclick="eliminarProducto(${index})" title="Eliminar Producto">
                        <img src="\\!Resource\\Images\\icono-borrar.png" class="icono-borrar" alt="Borrar">
                    </button>
                </td>
            </tr>
        `;
    });
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
        
        actualizarTabla();
    }
}
