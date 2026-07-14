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

function updateTabla() {
    const tabla = document.getElementById("tabla-productos");
    if (!tabla) return;

    const productos = JSON.parse(localStorage.getItem("inventario")) || [];
    
    const categoriaFiltro = tabla.getAttribute("data-categoria");
    
    const productosFiltrados = categoriaFiltro 
        ? productos.filter(prod => prod.categoria.toLowerCase() === categoriaFiltro.toLowerCase())
        : productos;
    tabla.innerHTML = "";

    productosFiltrados.forEach((prod, index) => {
        const imgSrc = prod.imagen || "\\!Resource\\Images\\placeholder.jpg";
        
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

function toggleMenu(){
    document.getElementById("menu-lateral").classList.toggle("activo");
    document.getElementById("overlay").classList.toggle("activo");
}

document.getElementById("overlay").addEventListener("click", function(){
    document.getElementById("menu-lateral").classList.remove("activo");
    this.classList.remove("activo");
});
