const { ipcRenderer } = require("electron");

// Funcion -> confirmar cambio de codigo
function ConfirmarCambioDeCodigo() {

    // mensaje de flujo
    console.log("CambiarCodigoWindow: confirmando cambio de codigo")

    // Paso -> obtener el nuevo codigo del input
    let NuevoCodigo = document.getElementById("CampoNuevoCodigo").value

    // Paso -> validar que no este vacio
    if (NuevoCodigo.trim() === "") {
        alert("Por favor ingrese un codigo")
        return
    }

    // Paso -> enviar el evento al main con el nuevo codigo
    ipcRenderer.send("ECambiarCodigo", NuevoCodigo)

}

// Funcion -> cancelar cambio de codigo
function CancelarCambioDeCodigo() {

    // mensaje de flujo
    console.log("CambiarCodigoWindow: cancelando cambio de codigo")

    // Paso -> enviar evento de cancelacion
    ipcRenderer.send("ECancelarCambioCodigo")

}

// Paso -> agregar event listeners a los botones
document.getElementById("BtnAceptar").addEventListener("click", ConfirmarCambioDeCodigo)
document.getElementById("BtnCancelar").addEventListener("click", CancelarCambioDeCodigo)

// Paso -> permitir confirmar con Enter
document.getElementById("CampoNuevoCodigo").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        ConfirmarCambioDeCodigo()
    }
})

// Evento -> mostrar mensaje de cambio de codigo
ipcRenderer.on("EMostrarMensajeCambio", (event, datos) => {

    // mensaje de flujo
    console.log("CambiarCodigoWindow: mostrando mensaje")
    console.log("CambiarCodigoWindow: tipo:", datos.tipo)
    console.log("CambiarCodigoWindow: texto:", datos.texto)

    // Paso -> obtener el elemento del mensaje
    let mensajeElement = document.getElementById("MensajeCambio")

    // Paso -> limpiar clases previas
    mensajeElement.className = ""

    // Paso -> agregar la clase según el tipo
    if (datos.tipo === "exito") {
        mensajeElement.classList.add("exito")
    } else if (datos.tipo === "error") {
        mensajeElement.classList.add("error")

        // Paso -> ocultar el mensaje de error después de 3 segundos
        setTimeout(() => {
            mensajeElement.className = ""
            mensajeElement.textContent = ""
        }, 3000)
    }

    // Paso -> establecer el texto del mensaje
    mensajeElement.textContent = datos.texto

})
