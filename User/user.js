function editarCampo(id){

    const campo = document.getElementById(id);

    const valor = prompt(
        "Nuevo valor:",
        campo.textContent
    );

    if(valor !== null && valor.trim() !== ""){

        campo.textContent = valor;

    }

}