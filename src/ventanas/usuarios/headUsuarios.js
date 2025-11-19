// Variables
const { ipcRenderer } = require("electron")

    // codigo
    let codigo = `
        <div class="Encabezado EncabezadoUsuarios">
            <h1 class="NombreEncabezado">Usuarios</h1>
            <button class="Boton BotonEncabezado" id="BotonFormularioNuevoUsuario">Nuevo</button>
        </div>
    `

// Funciones

    // Funcion -> mostrar el formulario nuevo cliente y actualizar el mensaje
    function ActualizarFormularioNuevoUsuario (){

        // mensaje de flujo
        console.log("MENSAJE: actualizar el formulario nuevo usuario")

        // Paso -> actualizar formulario nuevo usuario
        ipcRenderer.send("ActualizarFormularioNuevoUsuario")

    }

    // Funcion -> cargar encabezado
    function CargarEncabezado (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente encabezado de usuarios")

        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioEncabezadoUsuario = document.getElementById("EspacioEncabezadoUsuario")
        if(EspacioEncabezadoUsuario){
            // Paso -> insertar codigo
            EspacioEncabezadoUsuario.innerHTML = codigo
            // Paso -> agregar funcionalidad de boton
            document.getElementById("BotonFormularioNuevoUsuario").addEventListener("click",ActualizarFormularioNuevoUsuario)
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado")
        }

    }

module.exports = { CargarEncabezado };