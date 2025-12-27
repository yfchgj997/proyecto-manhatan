const { ipcRenderer } = require("electron");
const { aplicarMayusculas, restringirFechasFuturas, habilitarNavegacionEnter } = require("../../componentes/textUtils");

// Variables

// codigo
let codigo = ``

// Funciones

function ModificarCodigo(fecha) {
    // Mensaje de flujo
    console.log("Se ingresó a la función ModificarCodigo");
    console.log("Fecha:", fecha);
    let codigo = `
            <div class="Formulario">
                <h2 class="EncabezadoFormulario">Nuevo Movimiento</h2>
                <div class="Campos">
                    <div class="Campo">
                        <p>Fecha:</p>
                        <input id="CampoFechaMovimiento" name="fecha" type="date" value="${fecha}">
                    </div>
                    <div class="Campo">
                        <p>Cliente:</p>
                        <input id="CampoCliente" name="cliente" type="text">
                    </div>
                    <div class="Campo">
                        <p>Tipo:</p>
                        <select id="CampoTipoMovimiento" name="tipo">
                            <option value="venta" selected>Venta</option>
                            <option value="compra">Compra</option>
                        </select>
                    </div>
                    <div class="Campo">
                        <p>Monto Material:</p>
                        <input id="CampoMontoMaterial" name="montoMaterial" type="number" step="0.01">
                    </div>
                    <div class="Campo">
                        <p>Monto Económico:</p>
                        <input id="CampoMontoEconomico" name="montoEconomico" type="number" step="0.01">
                    </div>
                    <div class="Campo">
                        <p>Precio de Cambio:</p>
                        <input id="CampoPrecioCambio" name="precioCambio" type="number" step="0.01">
                    </div>
                </div>
                <button class="Boton BotonFormulario" id="BotonGuardarNuevoCompraVenta">Guardar</button>
            </div>
        `;

    return codigo; // Devuelve el HTML generado
}

function GuardarCompraVenta(usuarioAutenticado) {
    // Mensaje de flujo
    console.log("MENSAJE: Guardando un nuevo compra venta");

    // Capturar los datos raw para validación
    let tipo = document.getElementById("CampoTipoMovimiento").value;
    let fecha = document.getElementById("CampoFechaMovimiento").value;
    let cliente = document.getElementById("CampoCliente").value;
    let montoMaterial = document.getElementById("CampoMontoMaterial").value;
    let montoEconomico = document.getElementById("CampoMontoEconomico").value;
    let precioCambio = document.getElementById("CampoPrecioCambio").value;

    // Validar campos vacíos
    if (fecha.trim() === "") {
        // Mostrar una ventana de confirmación
        const opciones = {
            type: "error",
            buttons: ["Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `El campo Fecha es obligatorio`,
        };

        dialog.showMessageBoxSync(null, opciones);
        return;
    }
    if (cliente.trim() === "") {
        // Mostrar una ventana de confirmación
        const opciones = {
            type: "error",
            buttons: ["Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `El campo Cliente es obligatorio`,
        };

        dialog.showMessageBoxSync(null, opciones);
        return;
    }
    if (montoMaterial.trim() === "") {
        // Mostrar una ventana de confirmación
        const opciones = {
            type: "error",
            buttons: ["Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `El campo Monto Material es obligatorio`,
        };

        dialog.showMessageBoxSync(null, opciones);
        return;
    }
    if (montoEconomico.trim() === "") {
        // Mostrar una ventana de confirmación
        const opciones = {
            type: "error",
            buttons: ["Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `El campo Monto Económico es obligatorio`,
        };

        dialog.showMessageBoxSync(null, opciones);
        return;
    }
    if (precioCambio.trim() === "") {
        // Mostrar una ventana de confirmación
        const opciones = {
            type: "question",
            buttons: ["Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `El campo Precio de Cambio es obligatorio`,
        };

        dialog.showMessageBoxSync(null, opciones);
        return;
    }

    // Capturar los datos
    let NuevoCompraVenta = {
        "Tipo": tipo,
        "Fecha": fecha,
        "EmpleadoNombre": usuarioAutenticado.Nombres,
        "EmpleadoID": usuarioAutenticado.ID,
        "Cliente": cliente,
        "MontoMaterial": parseFloat(montoMaterial) || 0,
        "MontoEconomico": parseFloat(montoEconomico) || 0,
        "PrecioCambio": parseFloat(precioCambio) || 0,
    };

    // Mensaje de flujo
    console.log("MENSAJE: Estos son los datos de compra venta:");
    console.log(NuevoCompraVenta);

    // Obtener fechas del filtro
    let fechaInicio = document.getElementById("CampoTextoFechaInicial") ? document.getElementById("CampoTextoFechaInicial").value : "";
    let fechaFinal = document.getElementById("CampoTextoFechaFinal") ? document.getElementById("CampoTextoFechaFinal").value : "";

    let datosEnvio = {
        movimiento: NuevoCompraVenta,
        filtro: {
            fechaInicio: fechaInicio,
            fechaFinal: fechaFinal
        }
    };

    // Enviar los datos del movimiento al proceso principal
    ipcRenderer.send("EQuiereGuardarNuevoCompraVenta", datosEnvio);
}

function FormatearDecimales(input) {
    if (!input) return;
    input.addEventListener("blur", function () {
        let valor = parseFloat(this.value);
        if (!isNaN(valor)) {
            this.value = valor.toFixed(2);
        }
    });
}

// Funcion -> cargar componente
function CargarFormularioNuevoCompraVenta(usuarioAutenticado, fecha) {

    console.log("MENSAJE: cargando el componente formulario nuevo compra venta");

    let EspacioFormularioNuevoCompraVenta = document.getElementById("EspacioFormularioNuevoCompraVenta");

    if (EspacioFormularioNuevoCompraVenta) {
        // Paso -> actualizar el HTML generado
        codigo = ModificarCodigo(fecha);
        EspacioFormularioNuevoCompraVenta.innerHTML = codigo;

        // Agregar validacion de decimales
        FormatearDecimales(document.getElementById("CampoMontoMaterial"));
        FormatearDecimales(document.getElementById("CampoMontoEconomico"));
        FormatearDecimales(document.getElementById("CampoPrecioCambio"));

        // Paso -> restringir fechas futuras
        const campoFecha = document.getElementById("CampoFechaMovimiento");
        restringirFechasFuturas(campoFecha);

        // Paso -> aplicar mayúsculas al campo de cliente
        aplicarMayusculas(document.getElementById("CampoCliente"));

        // Paso -> habilitar navegación con Enter
        habilitarNavegacionEnter(EspacioFormularioNuevoCompraVenta);

        // Asegurarse de que el botón existe antes de agregar el evento
        let botonGuardar = document.getElementById("BotonGuardarNuevoCompraVenta");
        if (botonGuardar) {
            botonGuardar.addEventListener("click", () => { GuardarCompraVenta(usuarioAutenticado) });
        } else {
            console.log("ERROR: No se encontró el botón 'BotonGuardarNuevoMovimiento'");
        }
    } else {
        console.log("ERROR: No se pudo obtener el espacio para colocar formulario nuevo movimiento");
    }
}

ipcRenderer.on("EActualizarSoloCliente", (event, cliente) => {

    console.log("--------------")
    console.log(cliente)
    console.log("--------------")

    let boton = document.getElementById("BotonSelectCliente");
    if (boton) {
        boton.textContent = cliente.Nombres; // Actualiza el texto del botón con el nombre del cliente
        boton.setAttribute("nombres", cliente.Nombres); // Agrega un atributo personalizado 'nombres'
        boton.setAttribute("IDExterno", cliente.ID)
    } else {
        console.error("No se encontró el botón con ID 'BotonSelectCliente'");
    }
});

module.exports = { CargarFormularioNuevoCompraVenta };