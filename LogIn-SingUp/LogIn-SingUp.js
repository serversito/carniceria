function reproducirSonido(animal) {
    
    const rutaAudio = `/!Resource/Audio/${animal}.ogg`;
    
    const audio = new Audio(rutaAudio);
    
    audio.play().catch(error => {
        console.log("El audio no pudo reproducirse debido a restricciones del navegador:", error);
    });
}