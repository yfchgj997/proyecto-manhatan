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
        alert("Por favor ingrese un código");
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
