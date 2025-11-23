const { ipcRenderer } = require("electron");

// Variables

// codigo
let codigo = ``

// Funciones

// Funcion -> modificar codigo
function ModificarCodigo(usuario) {

    // mensaje de flujo
    console.log("MENSAJE: modificando el codigo de formulario editar usuario, este usuario llego:")
    console.log(usuario)

    codigo = `
            <div class="Formulario">
                <h2 class="EncabezadoFormulario">Editar Usuario</h2>
                <div class="Campos" id="FormularioEditarPersona" name="${usuario.ID}">
                    <div class="Campo">
                        <p>Nombres:</p>
                        <input id="CampoNombres" name="nombres" type="text" value="${usuario.Nombres}">
                    </div>
                    <div class="Campo">
                        <p>Apellidos:</p>
                        <input id="CampoApellidos" name="apellidos" type="text" value="${usuario.Apellidos}">
                    </div>
                    <div class="Campo">
                        <p>Contrasena:</p>
                        <input id="CampoContrasena" name="contrasena" type="text" value="${usuario.Contrasena}">
                    </div>
                    <div class="Campo">
                        <p>Rol:</p>
                        <select id="CampoRol" name="rol">
                            <option>${usuario.Rol}</option>
                            <option>Administrador</option>
                        </select>
                    </div>
                    <div class="Campo">
                        <p>Estado:</p>
                        <select id="CampoEstado" name="estado">
                            <option>${usuario.Estado}</option>
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </div>
                </div>
                <button class="Boton BotonFormulario" id="BotonEditarUsuario">Editar</button>
            </div>
        `
}

// Funcion -> editar cliente
function EditarUsuario() {

    // mensaje de flujo
    console.log("MENSAJE: editando los datos de un usuario")

    // Capturar los datos raw para validación
    let nombres = document.getElementById("CampoNombres").value;
    let apellidos = document.getElementById("CampoApellidos").value;
    let contrasena = document.getElementById("CampoContrasena").value;

    // Validar campos vacíos
    if (nombres.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Nombres es obligatorio." });
        return;
    }
    if (apellidos.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Apellidos es obligatorio." });
        return;
    }
    if (contrasena.trim() === "") {
        ipcRenderer.send("ModificarMensaje", { tipo: "MensajeMalo", texto: "El campo Contraseña es obligatorio." });
        return;
    }

    // paso -> crear una variable y capturar los datos
    let NuevoUsuario = {
        "ID": document.getElementById("FormularioEditarPersona").getAttribute("name"),
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
    ipcRenderer.send("EEditarUsuario", NuevoUsuario)

}

// Funcion -> cargar encabezado
function CargarFormularioEditarUsuario(usuario) {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente formulario editar usuario")
    console.log(usuario)

    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioFormularioEditarUsuario = document.getElementById("EspacioFormularioNuevoUsuario")
    if (EspacioFormularioEditarUsuario) {
        // Paso -> modificar codigo
        ModificarCodigo(usuario)
        // Paso -> insertar codigo
        EspacioFormularioEditarUsuario.innerHTML = codigo
        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonEditarUsuario").addEventListener("click", EditarUsuario)
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar formulario editar usuario")
    }

}

module.exports = { CargarFormularioEditarUsuario };