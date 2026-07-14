document.addEventListener("DOMContentLoaded", () => {
    actualizarTablaEmpleados();

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

function actualizarTablaEmpleados() {
    const tabla = document.getElementById("tabla-empleados");
    if (!tabla) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const esAdministrador = sesionUsuario && sesionUsuario.rol.toLowerCase() === "administrador";

    tabla.innerHTML = "";

    if (usuarios.length === 0) {
        tabla.innerHTML = `<tr><td colspan="8" style="text-align:center;">No hay empleados registrados en el sistema.</td></tr>`;
        return;
    }

    usuarios.forEach((user) => {
        const rutaFoto = user.foto ? user.foto : "/!Resource/Images/Foto-perfil.jpeg";

        let botonBorrar = "";
        if (esAdministrador) {
            botonBorrar = `
                <button class="btn-borrar" onclick="eliminarEmpleado('${user.id}')" title="Dar de baja empleado" style="background: transparent; border: none; cursor: pointer;">
                    <img src="/!Resource/Images/icono-borrar.png" alt="Borrar" style="height: 25px;">
                </button>
            `;
        } else {
            botonBorrar = `<span style="color: #a0a0a0; font-size: 12px;">No autorizado</span>`;
        }

        tabla.innerHTML += `
            <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <img src="${rutaFoto}" alt="Perfil" class="tabla-foto-perfil">
                </td>
                <td style="font-family: 'Atomicaboy'; color: #b13935; letter-spacing: 1px;">${user.id}</td>
                <td>${user.nombre} ${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.nacimiento}</td>
                <td>${user.genero}</td>
                <td>${user.rol}</td>
                <td style="text-align: center;">
                    ${botonBorrar}
                </td>
            </tr>
        `;
    });
}

function eliminarEmpleado(idEmpleado) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    const esAdministrador = usuarioLogueado && usuarioLogueado.rol.toLowerCase() === "administrador";
    if (!esAdministrador) {
        alert("Acción denegada: No tienes permisos de administrador para dar de baja al personal.");
        return;
    }

    if (usuarioLogueado && usuarioLogueado.id === idEmpleado) {
        alert("Operación denegada: No puedes eliminar tu propia cuenta de administrador mientras estás en sesión.");
        return;
    }

    if (confirm(`¿Estás seguro de que deseas dar de baja al empleado con ID: ${idEmpleado}?`)) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const listaActualizada = usuarios.filter(user => user.id !== idEmpleado);
        
        localStorage.setItem("usuarios", JSON.stringify(listaActualizada));
        actualizarTablaEmpleados();
        
        alert("El empleado ha sido removido del sistema correctamente.");
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