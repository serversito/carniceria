const form = document.getElementById('number-form');
const selectOperacion = document.getElementById('operacion');
const inputValor0 = document.getElementById('numero0');
const inputValor1 = document.getElementById('numero1');
const resultBox = document.getElementById('resultado-box');
const spanResult = document.getElementById('resultado');
 
form.addEventListener('submit', function(event) {
 
    event.preventDefault();
 
    const value0 = parseFloat(inputValor0.value)
    const value1 = parseFloat(inputValor1.value)
    const operation = selectOperacion.value
   
    if(isNaN(value0) || isNaN(value1)) {
        alert("Porfavor, introduce valores numericos validos.")
        return;
    }

    let resultado

    switch (operation){
        case "+":
        resultado = value0 + value1;
        break;

        case "-":
        resultado = value0 - value1;
        break;

        case "*":
        resultado = value0 * value1;
        break;

        case "/":
        if (value1 === 0 || value1 ){
            alert("No se puede dividir entre 0");
            return;
        }
        resultado = value0 / value1;
        break;
    }

    spanResult.textContent = resultado;
    resultBox.classList.remove('hidden');
});
 