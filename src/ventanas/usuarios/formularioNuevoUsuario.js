const { ipcRenderer } = require("electron");
const { aplicarMayusculasMultiple, habilitarNavegacionEnter } = require("../../componentes/textUtils");

// Variables

// codigo
let codigo = `
        <div class="Formulario">
            <h2 class="EncabezadoFormulario">Nuevo Usuario</h2>
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
                    <p>Contrasena:</p>
                    <input id="CampoContrasena" name="contrasena" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>Rol:</p>
                    <select id="CampoRol" name="rol">
                        <option>Administrador</option>
                        <option>Cajero</option>
                    </select>
                </div>
                <div class="Campo">
                    <p>Estado:</p>
                    <select id="CampoEstado" name="estado">
                        <option>Activo</option>
                    </select>
                </div>
            </div>
            <button class="Boton BotonFormulario" id="BotonGuardarNuevoUsuario">Guardar</button>
        </div>
    `

// Funciones

// Funcion -> guardar un nuevo cliente
function GardarNuevoUsuario() {

    // mensaje de flujo
    console.log("MENSAJE: guardando un nuevo usuario")

    // Capturar los datos raw para validación
    let nombres = document.getElementById("CampoNombres").value;
    let apellidos = document.getElementById("CampoApellidos").value;
    let contrasena = document.getElementById("CampoContrasena").value;

    // Validar campos vacíos
    if (nombres.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Nombres es obligatorio." });
        return;
    }
    if (contrasena.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Contraseña es obligatorio." });
        return;
    }

    // paso -> crear una variable y capturar los datos
    let NuevoUsuario = {
        "Nombres": nombres,
        "Apellidos": apellidos,
        "Contrasena": contrasena,
        "Rol": document.getElementById("CampoRol").value,
        "Estado": document.getElementById("CampoEstado").value
    }

    // mensaje de flujo
    console.log("MENSAJE: estos son los datos:")
    console.log(NuevoUsuario)

    // Paso -> enviar los datos del cliente al main
    ipcRenderer.send("EGuardarNuevoUsuario", NuevoUsuario)

}

// Funcion -> cargar encabezado
function CargarFormularioNuevoUsuario() {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente formulario nuevo usuario")

    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioFormularioNuevoUsuario = document.getElementById("EspacioFormularioNuevoUsuario")
    if (EspacioFormularioNuevoUsuario) {
        // Paso -> insertar codigo
        EspacioFormularioNuevoUsuario.innerHTML = codigo
        // Paso -> aplicar mayúsculas a los inputs de texto
        aplicarMayusculasMultiple(["CampoNombres", "CampoApellidos", "CampoContrasena"])
        // Paso -> habilitar navegación con Enter
        habilitarNavegacionEnter(EspacioFormularioNuevoUsuario);
        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonGuardarNuevoUsuario").addEventListener("click", GardarNuevoUsuario)
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar formulario nuevo usuario")
    }

}

module.exports = { CargarFormularioNuevoUsuario };