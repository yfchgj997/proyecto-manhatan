const { ipcRenderer } = require("electron");
const { aplicarMayusculasMultiple, establecerFechaActual, restringirFechasFuturas, habilitarNavegacionEnter } = require("../../componentes/textUtils");

// Variables

// codigo
let codigo = `
        <div class="Formulario">
            <h2 class="EncabezadoFormulario">Nuevo Cliente</h2>
            <div class="Campos">
                <div class="Campo">
                    <p>Nombres:</p>
                    <input id="CampoNombres" name="nombres" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>Apellidos:</p>
                    <input id="CampoApellidos" name="apellidos" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>DNI:</p>
                    <input id="CampoDNI" name="DNI" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>Fecha:</p>
                    <input id="CampoFecha" name="fecha" type="date">
                </div>
            </div>
            <button class="Boton BotonFormulario" id="BotonGuardarNuevoCliente">Guardar</button>
        </div>
    `

// Funciones

// Funcion -> guardar un nuevo cliente
function GardarNuevoCliente() {

    // mensaje de flujo
    console.log("MENSAJE: guardando un nuevo cliente")

    // Capturar los datos raw para validación
    let nombres = document.getElementById("CampoNombres").value;
    let apellidos = document.getElementById("CampoApellidos").value;
    let dni = document.getElementById("CampoDNI").value;
    let fechaIngreso = document.getElementById("CampoFecha").value;

    // Validar campos vacíos
    if (nombres.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Nombres es obligatorio." });
        return;
    }
    if (fechaIngreso.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Fecha es obligatorio." });
        return;
    }

    // paso -> crear una variable y capturar los datos
    let NuevoCliente = {
        "Nombres": nombres,
        "Apellidos": apellidos,
        "DNI": dni,
        "SaldoEconomico": 0,
        "SaldoMaterial": 0,
        "FechaIngreso": fechaIngreso
    }

    // mensaje de flujo
    console.log("MENSAJE: estos son los datos:")
    console.log(NuevoCliente)

    // Paso -> enviar los datos del cliente al main
    ipcRenderer.send("EGuardarNuevoCliente", NuevoCliente)

}

// Funcion -> cargar encabezado
function CargarFormularioNuevoCliente() {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente formulario nuevo cliente")

    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioFormularioNuevoCliente = document.getElementById("EspacioFormularioNuevoCliente")
    if (EspacioFormularioNuevoCliente) {
        // Paso -> insertar codigo
        EspacioFormularioNuevoCliente.innerHTML = codigo

        // Paso -> establecer fecha actual y restringir fechas futuras
        const campoFecha = document.getElementById("CampoFecha");
        establecerFechaActual(campoFecha);
        restringirFechasFuturas(campoFecha);

        // Paso -> aplicar mayúsculas a los inputs de texto
        aplicarMayusculasMultiple(["CampoNombres", "CampoApellidos", "CampoDNI"])

        // Paso -> habilitar navegación con Enter
        habilitarNavegacionEnter(EspacioFormularioNuevoCliente);

        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonGuardarNuevoCliente").addEventListener("click", GardarNuevoCliente)
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar encabezado")
    }

}

module.exports = { CargarFormularioNuevoCliente };