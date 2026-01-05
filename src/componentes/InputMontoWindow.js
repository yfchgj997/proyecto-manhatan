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

// Función -> mostrar mensaje
function MostrarMensaje(mensaje) {
    let espacio = document.getElementById("EspacioMensajeResultado");
    if (espacio) {
        let codigo = `
            <div class="Mensaje ${mensaje.tipo}">
                <p class="mensaje">${mensaje.texto}</p>
            </div>
        `;
        espacio.innerHTML = codigo;
    }
}

// Función -> validar y enviar monto
function ValidarYEnviarMonto() {
    let campoMonto = document.getElementById("CampoMonto");
    let monto = campoMonto.value.trim();

    const limpiarMensaje = () => {
        setTimeout(() => {
            let espacio = document.getElementById("EspacioMensajeResultado");
            if (espacio) espacio.innerHTML = "";
        }, 3000);
    };

    // Validar que no esté vacío
    if (monto === "") {
        MostrarMensaje({ tipo: "MensajeMalo", texto: "Por favor ingrese un monto" });
        limpiarMensaje();
        campoMonto.focus();
        return;
    }

    // Validar que sea un número válido
    let montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico)) {
        MostrarMensaje({ tipo: "MensajeMalo", texto: "Por favor ingrese un monto válido" });
        limpiarMensaje();
        campoMonto.focus();
        return;
    }

    // Validar que sea mayor a 0
    if (montoNumerico <= 0) {
        MostrarMensaje({ tipo: "MensajeMalo", texto: "El monto debe ser mayor a 0" });
        limpiarMensaje();
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

// Evento -> recibir resultado de la operación
ipcRenderer.on("EMensajeResultado", (event, mensaje) => {
    console.log("InputMontoWindow: resultado recibido:", mensaje);
    MostrarMensaje(mensaje);

    if (mensaje.tipo === "MensajeBueno") {
        // Desactivar botones para evitar doble clic
        document.getElementById("BtnConfirmar").disabled = true;
        document.getElementById("BtnCancelar").disabled = true;

        // Cerrar la ventana después de un momento
        setTimeout(() => {
            ipcRenderer.send("ECerrarIngresoMontoManual"); // Nuevo evento específico para cerrar tras éxito
        }, 1500);
    } else {
        // Si es un error o mensaje neutro, desaparecer el mensaje después de 3 segundos
        // pero NO cerrar la ventana
        setTimeout(() => {
            let espacio = document.getElementById("EspacioMensajeResultado");
            if (espacio) {
                espacio.innerHTML = "";
            }
        }, 3000);
    }
});

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
