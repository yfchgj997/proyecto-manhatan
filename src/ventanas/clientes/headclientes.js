// Variables

const { ipcRenderer } = require("electron")

    // codigo
    let codigo = `
        <div class="Encabezado EncabezadoClientes">
            <h1 class="NombreEncabezado">Clientes</h1>
            <button class="Boton BotonEncabezado" id="BotonFormularioNuevoCliente">Nuevo</button>
        </div>
    `

// Funciones

    // Funcion -> mostrar el formulario nuevo cliente y actualizar el mensaje
    function ActualizarFormularioNuevoCliente (){

        // mensaje de flujo
        console.log("MENSAJE: actualizar el formulario nuevo cliente")

        // Paso -> actualizar formulario nuevo cliente
        ipcRenderer.send("ActualizarFormularioNuevoCliente")

    }

    // Funcion -> cargar encabezado
    function CargarEncabezado (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente encabezado de clientes")

        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioEncabezadoCliente = document.getElementById("EspacioEncabezadoCliente")
        if(EspacioEncabezadoCliente){
            // Paso -> insertar codigo
            EspacioEncabezadoCliente.innerHTML = codigo
            // Paso -> agregar funcionalidad de boton
            document.getElementById("BotonFormularioNuevoCliente").addEventListener("click",ActualizarFormularioNuevoCliente)
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado")
        }

    }

module.exports = { CargarEncabezado };