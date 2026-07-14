document.addEventListener("DOMContentLoaded", () => {
    const formSignUp = document.getElementById("form-signup");
    const formLogIn = document.getElementById("form-login");

    let idEmpleadoOculto = "";

    if (formSignUp) {
        const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios")) || [];
        let idGenerado = "";
        let idRepetido = true;

        while (idRepetido) {
            idGenerado = Math.floor(10000 + Math.random() * 90000).toString();
            idRepetido = usuariosExistentes.some(user => user.id === idGenerado);
        }

        idEmpleadoOculto = idGenerado;
    }

    if (formSignUp) {
        formSignUp.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const nombre = document.getElementById("sign-nombre").value.trim();
            const apellido = document.getElementById("sign-apellido").value.trim();
            const nacimiento = document.getElementById("sign-nacimiento").value;
            const correo = document.getElementById("sign-correo").value.trim();
            const genero = document.querySelector('input[name="genero"]:checked').value;
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const nuevoUsuario = {
                id: idEmpleadoOculto, 
                nombre: nombre,
                apellido: apellido,
                nacimiento: nacimiento,
                correo: correo,
                genero: genero,
                rol: "Empleado"
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert(`¡Registro completado con éxito!\n\nTu ID de empleado asignado es: ${idEmpleadoOculto}\n\nPor favor, anótalo.`);

            localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));

            window.location.href = "/Home/home.html";
        });
    }
    
    if (formLogIn) {
        formLogIn.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById("login-nombre").value.trim();
            const apellidoInput = document.getElementById("login-apellido").value.trim();
            const idInput = document.getElementById("login-id").value.trim();
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuarioValidado = usuarios.find(user => 
                user.id === idInput && 
                user.nombre.toLowerCase() === nombreInput.toLowerCase() &&
                user.apellido.toLowerCase() === apellidoInput.toLowerCase()
            );

            if (usuarioValidado) {
                localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValidado));
                alert(`Bienvenido de nuevo, ${usuarioValidado.nombre}.`);
                window.location.href = "/Home/home.html";
            } else {
                alert("Acceso denegado. El Nombre, Apellido o ID de empleado no coinciden con ningún usuario registrado.");
            }
        });
    }
});

function reproducirSonido(animal) {
    
    const rutaAudio = `/!Resource/Audio/${animal}.ogg`;
    
    const audio = new Audio(rutaAudio);
    
    audio.play().catch(error => {
        console.log("El audio no pudo reproducirse debido a restricciones del navegador:", error);
    });
}