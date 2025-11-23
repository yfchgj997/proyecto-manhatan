const { ipcRenderer } = require("electron");

// Variables

// codigo
let codigo = ``

// Funciones

// Funcion -> modificar codigo
function ModificarCodigo(clientes, usuario, Fecha) {

    // Mensaje de flujo
    console.log("si ingreso a la funcion modificar codigo");
    console.log(clientes);
    console.log(usuario)

    let codigo = `
            <div class="Formulario">
                <h2 class="EncabezadoFormulario">Nuevo Movimiento</h2>
                <div class="Campos">
                    <div class="Campo">
                        <p>Tipo de movimiento:</p>
                        <select id="CampoTipoMovimiento" name="tipo">
                            <option>Retiro</option>
                            <option>Ingreso</option>
                        </select>
                    </div>
                    <div class="Campo">
                        <p>Fecha:</p>
                        <input value="${Fecha}" id="CampoFechaMovimiento" name="fecha" type="date">
                    </div>
                    <div class="Campo">
                        <p>Usuario:</p>
                        <select id="CampoUsuarioMovimiento" name="usuario">
                            <option>${usuario.Nombres}</option>
                        </select>
                    </div>
                    <div class="Campo">
                        <p>Cliente Externo:</p>
                        <button id="BotonSelectCliente">seleccionar...</button>
                    </div>
                    <div class="Campo">
                        <p>Importe:</p>
                        <input id="CampoImporteMovimiento" name="importe" type="number" value="0.00">
                    </div>
                    <div class="Campo">
                        <p>Observacion:</p>
                        <input id="CampoObservacionMovimiento" name="observacion" type="text" placeholder="...">
                    </div>
                </div>
                <button class="Boton BotonFormulario" id="BotonGuardarNuevoMovimiento">Guardar</button>
            </div>
        `;

    return codigo; // Devuelve el HTML generado
}



// Modificar la forma en que se obtiene el "nombre" del cliente
function GuardarNuevoMovimiento(usuario) {

    // Mensaje de flujo
    console.log("MM-FormularioNuevo: guardando un nuevo movimiento");
    console.log("Verificando si el botón existe:", document.getElementById("BotonSelectCliente"));
    console.log("Verificando contenido de EspacioFormularioNuevoMovimiento:", document.getElementById("EspacioFormularioNuevoMovimiento").innerHTML);

    // Capturar los datos raw para validación
    let fecha = document.getElementById("CampoFechaMovimiento").value;
    let clienteID = document.getElementById("BotonSelectCliente").getAttribute("IDExterno");
    let tipo = document.getElementById("CampoTipoMovimiento").value;
    let importe = document.getElementById("CampoImporteMovimiento").value;
    let observacion = document.getElementById("CampoObservacionMovimiento").value;



    // Capturar los datos
    let NuevoMovimiento = {
        "Tipo": tipo,
        "Fecha": fecha,
        "UsuarioID": usuario.ID,
        "UsuarioNombres": usuario.Nombres,
        "ClienteID": clienteID,
        "ClienteNombres": document.getElementById("BotonSelectCliente").getAttribute("nombres"),
        "Importe": Number(importe),
        "Observacion": observacion,
    };

    // Mensaje de flujo
    console.log("MENSAJE: estos son los datos del movimiento:");
    console.log(NuevoMovimiento);

    // Enviar los datos del cliente al proceso principal
    ipcRenderer.send("EGuardarNuevoMovimientoMaterial", NuevoMovimiento);
}

// Funcion -> mostrar el formulario nuevo cliente y actualizar el mensaje
function EnviarEvento() {

    // mensaje de flujo
    console.log("MENSAJE: se quiere seleccionar un cliente")

    // Paso -> actualizar formulario nuevo cliente
    ipcRenderer.send("EQuiereSeleccionarCliente")

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

// Funcion -> cargar encabezado
function MostrarFormularioNuevoMovimientoMaterial(clientes, usuario, Fecha) {

    // mensaje de flujo
    console.log("MM-FormularioNuevo: mostrando el formulario");

    let EspacioFormularioNuevoMovimiento = document.getElementById("EspacioFormularioNuevoMovimiento");

    if (EspacioFormularioNuevoMovimiento) {
        // Paso -> actualizar el HTML generado
        codigo = ModificarCodigo(clientes, usuario, Fecha);
        EspacioFormularioNuevoMovimiento.innerHTML = codigo;

        // Agregar validacion de decimales
        FormatearDecimales(document.getElementById("CampoImporteMovimiento"));

        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonSelectCliente").addEventListener("click", EnviarEvento)

        // Asegurarse de que el botón existe antes de agregar el evento
        let botonGuardar = document.getElementById("BotonGuardarNuevoMovimiento");
        if (botonGuardar) {
            botonGuardar.addEventListener("click", () => { GuardarNuevoMovimiento(usuario) });
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

module.exports = { MostrarFormularioNuevoMovimientoMaterial };