document.addEventListener("DOMContentLoaded", () => {
    inicializarHorariosBase();
    cargarHorariosOpcion1();

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

function inicializarHorariosBase() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const horariosGlobales = JSON.parse(localStorage.getItem("horariosEmpleados")) || {};
    let huboCambios = false;

    usuarios.forEach(user => {
        if (!horariosGlobales[user.id]) {
            horariosGlobales[user.id] = {
                lunes: "Descanso",
                martes: "Descanso",
                miercoles: "Descanso",
                jueves: "Descanso",
                viernes: "Descanso",
                sabado: "Descanso",
                domingo: "Descanso"
            };
            huboCambios = true;
        }
    });

    if (huboCambios) {
        localStorage.setItem("horariosEmpleados", JSON.stringify(horariosGlobales));
    }
}

function cargarHorariosOpcion1() {
    const tbody = document.getElementById("tabla-horarios");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const horariosGlobales = JSON.parse(localStorage.getItem("horariosEmpleados")) || {};
    const sesionUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const esAdministrador = sesionUsuario && sesionUsuario.rol.toLowerCase() === "administrador";

    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No hay empleados registrados para asignar horarios.</td></tr>`;
        return;
    }

    const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    usuarios.forEach(user => {
        const foto = user.foto ? user.foto : "/!Resource/Images/Foto-perfil.jpeg";
        const horariosDelUsuario = horariosGlobales[user.id] || {
            lunes: "Descanso", martes: "Descanso", miercoles: "Descanso", 
            jueves: "Descanso", viernes: "Descanso", sabado: "Descanso", domingo: "Descanso"
        };
        
        let fila = `<tr>
            <td>
                <div class="empleado-celda">
                    <img src="${foto}" class="tabla-foto-perfil" alt="Perfil">
                </div>
            </td>`;

        diasSemana.forEach(dia => {
            const turnoActual = horariosDelUsuario[dia] || "Descanso";
            const claseTurno = turnoActual.toLowerCase();

            if (esAdministrador) {
                fila += `
                    <td>
                        <select class="select-horario badge-turno ${claseTurno}" onchange="cambiarEstiloSelect(this); guardarCambioHorario('${user.id}', '${dia}', this.value)">
                            <option value="Matutino" ${turnoActual === "Matutino" ? "selected" : ""}>Matutino</option>
                            <option value="Vespertino" ${turnoActual === "Vespertino" ? "selected" : ""}>Vespertino</option>
                            <option value="Descanso" ${turnoActual === "Descanso" ? "selected" : ""}>Descanso</option>
                        </select>
                    </td>`;
            } else {
                fila += `<td><span class="badge-turno ${claseTurno}">${turnoActual}</span></td>`;
            }
        });

        fila += `</tr>`;
        tbody.innerHTML += fila;
    });
}

function cambiarEstiloSelect(select) {
    select.classList.remove("matutino", "vespertino", "descanso");
    const nuevoTurno = select.value.toLowerCase();
    select.classList.add(nuevoTurno);
}

function guardarCambioHorario(empleadoId, dia, nuevoTurno) {
    const horariosGlobales = JSON.parse(localStorage.getItem("horariosEmpleados")) || {};

    if (!horariosGlobales[empleadoId]) {
        horariosGlobales[empleadoId] = {};
    }

    horariosGlobales[empleadoId][dia] = nuevoTurno;

    localStorage.setItem("horariosEmpleados", JSON.stringify(horariosGlobales));
    
    console.log(`Guardado permanente: Empleado ${empleadoId} -> ${dia}: ${nuevoTurno}`);
}

function toggleMenu(){
    document.getElementById("menu-lateral").classList.toggle("activo");
    const overlay = document.getElementById("overlay");
    if(overlay) overlay.classList.toggle("activo");
}

const overlayBtn = document.getElementById("overlay");
if (overlayBtn) {
    overlayBtn.addEventListener("click", function(){
        document.getElementById("menu-lateral").classList.remove("activo");
        this.classList.remove("activo");
    });
}