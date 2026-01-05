const { ipcRenderer } = require("electron");

// Variables
let codigo = "";

// Funciones

function GenerarCodigo() {
    return `
        <div class="Formulario">
            <h2 class="EncabezadoFormulario">Gestionar Capital</h2>
            <div class="Campos">
                <div class="Campo">
                    <p>Tipo de Capital:</p>
                    <select id="CampoTipoCapital" name="tipoCapital">
                        <option value="Economico">Económico</option>
                        <option value="Material">Material</option>
                    </select>
                </div>
                <div class="Campo">
                    <p>Operación:</p>
                    <select id="CampoOperacion" name="operacion">
                        <option value="aumentar">Aumentar</option>
                        <option value="disminuir">Disminuir</option>
                    </select>
                </div>
                <div class="Campo">
                    <p>Monto / Peso:</p>
                    <input id="CampoMontoCapital" name="monto" type="number" step="0.01" placeholder="0.00">
                </div>
                <div class="Campo">
                    <p>Detalle:</p>
                    <input id="CampoDetalleCapital" name="detalle" type="text" placeholder="Ej: Ingreso por venta...">
                </div>
            </div>
            <button class="Boton BotonFormulario" id="BotonGuardarCapital">Guardar</button>
        </div>
    `;
}

function GuardarCapital() {
    console.log("FormularioGestionarCapital: Guardando cambios...");

    let tipoCapital = document.getElementById("CampoTipoCapital").value;
    let operacion = document.getElementById("CampoOperacion").value;
    let monto = document.getElementById("CampoMontoCapital").value;
    let detalle = document.getElementById("CampoDetalleCapital").value;

    // Validaciones básicas
    if (monto === "" || parseFloat(monto) <= 0) {
        ipcRenderer.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Por favor ingrese un monto válido mayor a 0"
        });
        return;
    }

    // Mapear al tipo de operación esperado por el backend (main.js)
    // main.js espera: "aumentarEconomico", "disminuirEconomico", "aumentarMaterial", "disminuirMaterial"
    let tipoOperacion = operacion + tipoCapital;

    let datos = {
        monto: parseFloat(monto).toFixed(2),
        detalle: detalle,
        tipo: tipoOperacion
    };

    console.log("FormularioGestionarCapital: Enviando datos:", datos);
    ipcRenderer.send("EMontoIngresado", datos);
}

function CargarFormularioGestionarCapital() {
    console.log("FormularioGestionarCapital: Cargando componente");

    let Espacio = document.getElementById("EspacioFormularioCuentaEmpresarial");

    if (Espacio) {
        Espacio.innerHTML = GenerarCodigo();

        // Event listener para el botón
        document.getElementById("BotonGuardarCapital").addEventListener("click", GuardarCapital);

        // Permitir guardar con Enter
        document.getElementById("CampoMontoCapital").addEventListener("keypress", (event) => {
            if (event.key === "Enter") GuardarCapital();
        });
        document.getElementById("CampoDetalleCapital").addEventListener("keypress", (event) => {
            if (event.key === "Enter") GuardarCapital();
        });
    } else {
        console.log("ERROR: No se encontró el espacio para el formulario de gestión de capital");
    }
}

module.exports = { CargarFormularioGestionarCapital };
