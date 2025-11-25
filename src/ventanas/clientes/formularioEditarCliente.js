const { ipcRenderer } = require("electron");
const { aplicarMayusculasMultiple, restringirFechasFuturas, habilitarNavegacionEnter } = require("../../componentes/textUtils");

// Variables

// codigo
let codigo = ``

// Funciones

// Funcion -> modificar codigo
function ModificarCodigo(cliente) {

    // mensaje de flujo
    console.log("MENSAJE: modificando el codigo de formulario editar cliente, este cliente llego:")
    console.log(cliente)

    codigo = `
            <div class="Formulario">
                <h2 class="EncabezadoFormulario">Editar Cliente</h2>
                <div class="Campos" id="FormularioEditarPersona" name="${cliente.ID}">
                    <div class="Campo">
                        <p>Nombres:</p>
                        <input id="CampoNombres" name="nombres" type="text" value="${cliente.Nombres}">
                    </div>
                    <div class="Campo">
                        <p>Apellidos:</p>
                        <input id="CampoApellidos" name="apellidos" type="text" value="${cliente.Apellidos}">
                    </div>
                    <div class="Campo">
                        <p>DNI:</p>
                        <input id="CampoDNI" name="DNI" type="text" value="${cliente.DNI}">
                    </div>
                    <div class="Campo">
                        <p>Fecha:</p>
                        <input id="CampoFecha" name="fecha" type="date" value="${cliente.FechaIngreso}">
                    </div>
                </div>
                <button class="Boton BotonFormulario" id="BotonEditarCliente">Editar</button>
            </div>
        `
}

// Funcion -> editar cliente
function EditarCliente(cliente) {

    // mensaje de flujo
    console.log("MENSAJE: editando los datos de un cliente")

    // Capturar los datos raw para validación
    let nombres = document.getElementById("CampoNombres").value;
    let apellidos = document.getElementById("CampoApellidos").value;
    let dni = document.getElementById("CampoDNI").value;
    let fecha = document.getElementById("CampoFecha").value;

    // Validar campos vacíos
    if (nombres.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Nombres es obligatorio." });
        return;
    }
    if (apellidos.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Apellidos es obligatorio." });
        return;
    }
    if (dni.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo DNI es obligatorio." });
        return;
    }
    if (fecha.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Fecha es obligatorio." });
        return;
    }

    // paso -> crear una variable y capturar los datos
    let NuevoCliente = {
        "ID": document.getElementById("FormularioEditarPersona").getAttribute("name"),
        "Nombres": nombres,
        "Apellidos": apellidos,
        "DNI": dni,
        "Fecha": fecha,
        "SaldoEconomico": cliente.SaldoEconomico,
        "SaldoMaterial": cliente.SaldoMaterial
    }

    // mensaje de flujo
    console.log("MENSAJE: estos son los datos:")
    console.log(NuevoCliente)

    // Paso -> enviar los datos del cliente al main
    ipcRenderer.send("EEditarCliente", NuevoCliente)

}

// Funcion -> cargar encabezado
function CargarFormularioEditarCliente(cliente) {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente formulario editar cliente")
    console.log(cliente)

    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioFormularioEditarCliente = document.getElementById("EspacioFormularioNuevoCliente")
    if (EspacioFormularioEditarCliente) {
        // Paso -> modificar codigo
        ModificarCodigo(cliente)
        // Paso -> insertar codigo
        EspacioFormularioEditarCliente.innerHTML = codigo

        // Paso -> restringir fechas futuras
        const campoFecha = document.getElementById("CampoFecha");
        restringirFechasFuturas(campoFecha);

        // Paso -> aplicar mayúsculas a los inputs de texto
        aplicarMayusculasMultiple(["CampoNombres", "CampoApellidos", "CampoDNI"])

        // Paso -> habilitar navegación con Enter
        habilitarNavegacionEnter(EspacioFormularioEditarCliente);

        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonEditarCliente").addEventListener("click", () => { EditarCliente(cliente) })
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar formulario editar cliente")
    }

}

module.exports = { CargarFormularioEditarCliente };