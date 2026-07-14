function reproducirSonido(animal) {
    
    const rutaAudio = `/!Resource/Audio/${animal}.ogg`;
    
    const audio = new Audio(rutaAudio);
    
    audio.play().catch(error => {
        console.log("El audio no pudo reproducirse debido a restricciones del navegador:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarDatosUsuario();
});

function renderizarDatosUsuario() {
    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (sesionUsuario) {

        const imgPerfil = document.getElementById("foto-perfil");
        if (sesionUsuario.foto) {
            imgPerfil.src = sesionUsuario.foto;
        } else {
            imgPerfil.src = "/!Resource/Images/Foto-perfil.jpeg";
        }

        document.querySelector(".usuario-container h2").textContent = sesionUsuario.nombre;
        document.querySelector(".user-role").textContent = sesionUsuario.rol;
        document.getElementById("text-nombre").textContent = sesionUsuario.nombre;
        document.getElementById("text-apellido").textContent = sesionUsuario.apellido;
        document.getElementById("text-id").textContent = sesionUsuario.id;
        document.getElementById("date-nacimiento").textContent = sesionUsuario.nacimiento;
        document.getElementById("text-correo").textContent = sesionUsuario.correo;
        document.getElementById("text-genero").textContent = sesionUsuario.genero;
    }
}

function cambiarFotoPerfil(input) {
    if (input.files && input.files[0]) {
        const lector = new FileReader();

        lector.onload = function(e) {
            const cadenaBase64 = e.target.result;

            const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
            if (!sesionUsuario) return;

            sesionUsuario.foto = cadenaBase64;
            localStorage.setItem("usuarioLogueado", JSON.stringify(sesionUsuario));

            const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const listaActualizada = listaUsuarios.map(user => {
                if (user.id === sesionUsuario.id) {
                    return { ...user, foto: cadenaBase64 };
                }
                return user;
            });
            localStorage.setItem("usuarios", JSON.stringify(listaActualizada));

            renderizarDatosUsuario();
        };

        lector.readAsDataURL(input.files[0]);
    }
}

function conmutarEdicion(propiedad, idCaja, idBoton) {
    const caja = document.getElementById(idCaja);
    const boton = document.getElementById(idBoton);
    const icono = boton.querySelector("img");

        if (propiedad === "genero") {

        if (!caja.querySelector("select")) {

            const valorActual = caja.textContent.trim();

            const select = document.createElement("select");
            select.className = "inf-caja en-edicion";

            ["Masculino", "Femenino"].forEach(opcion => {

                const option = document.createElement("option");
                option.value = opcion;
                option.textContent = opcion;

                if (opcion === valorActual) {
                    option.selected = true;
                }

                select.appendChild(option);

            });

            caja.innerHTML = "";
            caja.appendChild(select);

            icono.src = "/!Resource/Images/icono-guardar.png";

            return;
        }

        const nuevoValor = caja.querySelector("select").value;

        const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
        if (!sesionUsuario) return;

        sesionUsuario.genero = nuevoValor;
        localStorage.setItem("usuarioLogueado", JSON.stringify(sesionUsuario));

        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const listaActualizada = listaUsuarios.map(user => {

            if (user.id === sesionUsuario.id) {
                return {
                    ...user,
                    genero: nuevoValor
                };
            }

            return user;

        });

        localStorage.setItem("usuarios", JSON.stringify(listaActualizada));

        icono.src = "/!Resource/Images/icono-editar.png";

        renderizarDatosUsuario();

        return;
    }

    if (caja.getAttribute("contenteditable") !== "true") {

        caja.setAttribute("contenteditable", "true");
        caja.classList.add("en-edicion");
        caja.focus();
        icono.src = "/!Resource/Images/icono-guardar.png"
        
    } 
    
    else {
        
        const nuevoValor = caja.textContent.trim();

        if (nuevoValor === "") {
            alert("El campo no puede quedar completamente vacío.");
            renderizarDatosUsuario();
            return;
        }

        const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
        if (!sesionUsuario) return;

        sesionUsuario[propiedad] = nuevoValor;
        localStorage.setItem("usuarioLogueado", JSON.stringify(sesionUsuario));

        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const listaActualizada = listaUsuarios.map(user => {
            if (user.id === sesionUsuario.id) {
                return { ...user, [propiedad]: nuevoValor };
            }
            return user;
        });

        

        localStorage.setItem("usuarios", JSON.stringify(listaActualizada));

        caja.setAttribute("contenteditable", "false");
        caja.classList.remove("en-edicion");

        icono.src = "/!Resource/Images/icono-editar.png";

        renderizarDatosUsuario();
    }
}
