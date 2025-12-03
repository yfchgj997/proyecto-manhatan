// Variables
const { ipcRenderer } = require("electron")

// codigo
let codigo = `
        <div class="Encabezado EncabezadoUsuarios">
            <h1 class="NombreEncabezado">Usuarios</h1>
            <div class="BotonesEncabezado">
                <button class="Boton BotonEncabezado" id="BotonFormularioNuevoUsuario">Nuevo</button>
                <button class="Boton BotonEncabezado" id="BotonFormularioCambiarCodigo">Cambiar codigo</button>
            </div>
        </div>
    `

// Funciones

// Funcion -> mostrar el formulario nuevo cliente y actualizar el mensaje
function ActualizarFormularioNuevoUsuario() {

    // mensaje de flujo
    console.log("MENSAJE: actualizar el formulario nuevo usuario")

    // Paso -> actualizar formulario nuevo usuario
    ipcRenderer.send("ActualizarFormularioNuevoUsuario")

}

// Funcion -> cambiar codigo
function CambiarCodigo() {

    // mensaje de flujo
    console.log("MENSAJE: se quiere cambiar el codigo")

    // Paso -> enviar evento
    ipcRenderer.send("EQuiereCambiarCodigo")

}

// Funcion -> cargar encabezado
function CargarEncabezado() {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente encabezado de usuarios")

    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioEncabezadoUsuario = document.getElementById("EspacioEncabezadoUsuario")
    if (EspacioEncabezadoUsuario) {
        // Paso -> insertar codigo
        EspacioEncabezadoUsuario.innerHTML = codigo
        // Paso -> agregar funcionalidad de boton
        document.getElementById("BotonFormularioNuevoUsuario").addEventListener("click", ActualizarFormularioNuevoUsuario)
        document.getElementById("BotonFormularioCambiarCodigo").addEventListener("click", CambiarCodigo)
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar encabezado")
    }

}

module.exports = { CargarEncabezado };