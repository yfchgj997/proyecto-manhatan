const { ipcRenderer } = require("electron");

// Variables
let tipoOperacion = "";

// Evento -> inicializar ventana
ipcRenderer.on("EInicializarInputMontoWindow", (event, datos) => {
    // Mensaje de flujo
    console.log("InputMontoWindow: inicializando ventana");
    console.log("InputMontoWindow: datos recibidos:", datos);

    // Guardar el tipo de operación
    tipoOperacion = datos.tipo;

    // Actualizar el título según el tipo de operación
    let titulo = "";
    switch (tipoOperacion) {
        case "aumentarEconomico":
            titulo = "Aumentar Capital Economico";
            break;
        case "disminuirEconomico":
            titulo = "Disminuir Capital Economico";
            break;
        case "aumentarMaterial":
            titulo = "Aumentar Capital Material";
            break;
        case "disminuirMaterial":
            titulo = "Disminuir Capital Material";
            break;
        default:
            titulo = "Ingresar Monto";
    }

    document.getElementById("TituloOperacion").textContent = titulo;

    // Enfocar el campo de monto
    document.getElementById("CampoMonto").focus();
});

// Función -> validar y enviar monto
function ValidarYEnviarMonto() {
    let campoMonto = document.getElementById("CampoMonto");
    let monto = campoMonto.value.trim();

    // Validar que no esté vacío
    if (monto === "") {
        alert("Por favor ingrese un monto");
        campoMonto.focus();
        return;
    }

    // Validar que sea un número válido
    let montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico)) {
        alert("Por favor ingrese un monto válido");
        campoMonto.focus();
        return;
    }

    // Validar que sea mayor a 0
    if (montoNumerico <= 0) {
        alert("El monto debe ser mayor a 0");
        campoMonto.focus();
        return;
    }

    // Formatear a 2 decimales
    let montoFormateado = montoNumerico.toFixed(2);

    // Capturar detalle
    let detalle = document.getElementById("CampoDetalle").value.trim();

    // Mensaje de flujo
    console.log("InputMontoWindow: enviando monto:", montoFormateado);
    console.log("InputMontoWindow: enviando detalle:", detalle);
    console.log("InputMontoWindow: tipo de operación:", tipoOperacion);

    // Enviar el monto al proceso principal
    ipcRenderer.send("EMontoIngresado", {
        monto: montoFormateado,
        detalle: detalle,
        tipo: tipoOperacion
    });
}

// Función -> cancelar operación
function CancelarOperacion() {
    console.log("InputMontoWindow: operación cancelada");
    ipcRenderer.send("ECancelarIngresoMonto");
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Botón confirmar
    document.getElementById("BtnConfirmar").addEventListener("click", ValidarYEnviarMonto);

    // Botón cancelar
    document.getElementById("BtnCancelar").addEventListener("click", CancelarOperacion);

    // Permitir confirmar con Enter
    document.getElementById("CampoMonto").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            ValidarYEnviarMonto();
        }
    });

    // Formatear a 2 decimales al perder el foco
    document.getElementById("CampoMonto").addEventListener("blur", function () {
        let valor = parseFloat(this.value);
        if (!isNaN(valor) && valor > 0) {
            this.value = valor.toFixed(2);
        }
    });
});
