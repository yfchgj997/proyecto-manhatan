const { ipcRenderer } = require("electron");

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Enfocar el campo de código
    document.getElementById("CampoCodigo").focus();

    // Botón confirmar
    document.getElementById("BtnConfirmar").addEventListener("click", ValidarYEnviarCodigo);

    // Botón cancelar
    document.getElementById("BtnCancelar").addEventListener("click", CancelarOperacion);

    // Permitir confirmar con Enter
    document.getElementById("CampoCodigo").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            ValidarYEnviarCodigo();
        }
    });
});

// Función -> validar y enviar código
function ValidarYEnviarCodigo() {
    let campoCodigo = document.getElementById("CampoCodigo");
    let codigo = campoCodigo.value.trim();

    // Validar que no esté vacío
    if (codigo === "") {
        // Obtener el elemento del mensaje
        let mensajeElement = document.getElementById("MensajeVerificacion")

        // Mostrar error inline
        mensajeElement.className = "error"
        mensajeElement.textContent = "Por favor ingrese un codigo"

        // Ocultar después de 3 segundos
        setTimeout(() => {
            mensajeElement.className = ""
            mensajeElement.textContent = ""
        }, 3000)

        campoCodigo.focus();
        return;
    }

    // Mensaje de flujo
    console.log("InputCodigoWindow: verificando código");
    console.log("InputCodigoWindow: este es el código:", codigo);

    // Enviar el código al proceso principal
    ipcRenderer.send("ECodigoIngresado", codigo);
}

// Función -> cancelar operación
function CancelarOperacion() {
    console.log("InputCodigoWindow: operación cancelada");
    ipcRenderer.send("ECancelarIngresoCodigo");
}

// Evento -> mostrar mensaje de verificación
ipcRenderer.on("EMostrarMensajeVerificacion", (event, datos) => {

    // mensaje de flujo
    console.log("InputCodigoWindow: mostrando mensaje de verificación")
    console.log("InputCodigoWindow: tipo:", datos.tipo)
    console.log("InputCodigoWindow: texto:", datos.texto)

    // Paso -> obtener el elemento del mensaje
    let mensajeElement = document.getElementById("MensajeVerificacion")

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
