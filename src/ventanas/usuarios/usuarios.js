const { ipcRenderer } = require('electron');

// Componentes necesarios
const { CargarEncabezado } = require('./headUsuarios.js')
const { CargarMensajeUsuarios } = require('./mensajeUsuarios.js')
const { CargarFormularioNuevoUsuario } = require('./formularioNuevoUsuario.js')
const { CargarFormularioEditarUsuario } = require('./formularioEditarUsuario.js')
const { CargarTablaUsuarios } = require('./tablaUsuarios.js')
const { CargarBuscadorUsuarios } = require('./buscadorUsuarios.js')
/*
const { CargarEncabezado } = require('./headclientes.js')
const { CargarFormularioNuevoCliente } = require('./formularioNuevoCliente.js')
const { CargarFormularioEditarCliente } = require('./formularioEditarCliente.js')
const { CargarBuscadorCliente } = require('./buscadorCliente.js')
const { CargarTablaClientes } = require('./tablaClientes.js')
const { CargarMensajeCliente } = require('./mensajeClientes.js')
*/
let codigo = `

<div id="VentanaClientes">
    <div class="AreaEncabezado" id="EspacioEncabezadoUsuario"></div>
    <div class="AreaCuerpo">
        <div class="CuerpoIzquierdo">
            <div class="EspacioBuscador" id="EspacioBuscadorUsuarios"></div>
            <div class="EspacioTabla" id="EspacioTablaUsuarios"></div>
        </div>
        <div class="CuerpoDerecho">
            <div class="EspacioFormulario" id="EspacioFormularioNuevoUsuario"></div>
            <div class="EspacioMensaje" id="EspacioMensajeUsuario"></div>
        </div>
    </div>
</div>
`
// Funciones

    // Funcion -> cargar la estructura de la ventana especificada en codigo
    function CargarEstructura (){

        // Paso -> obtener el espacio para colocar la estructura
        let EspacioGestionarClientes = document.getElementById("EspacioContenido")
        // Paso -> insertar codigo
        if(EspacioGestionarClientes){
            EspacioGestionarClientes.innerHTML = codigo
        }else{
            console.log("ERROR: no se pudo obtener el espacio para colocar la ventana gestionar clientes")
        }
    }

// Eventos
    
    // Evento 1 -> mostrar la ventana
    ipcRenderer.on("EMostrarVentanaGestionarUsuarios",(event,Datos)=>{
    
        // mensaje de flujo
        console.log("MENSAJE: se quiere gestionar usuarios")
        console.log("MENSAJE: se cargaran todos los componentes")
    
        // Paso -> insertar la estructura inicial
        CargarEstructura()

        // Paso -> cargar el componente cabezera o head
        CargarEncabezado()

        // Paso -> cargar el formulario nuevo cliente
        CargarFormularioNuevoUsuario()

        // Paso -> cargar el buscador de clientes
        CargarBuscadorUsuarios()
        
        // Paso -> cargar la tabla clientes
        CargarTablaUsuarios(Datos)

        // Paso -> cargar los mensajes
        CargarMensajeUsuarios({tipo:"MensajeNeutro",texto:"Bienvenido!"})
    })

    // Evento -> actualizar la tabla clientes
    ipcRenderer.on("ActualizarTablaUsuarios",(event,Datos)=>{
        console.log("MENSAJE: esta es la tabla usuarios que llego:")
        console.log(Datos)
        CargarTablaUsuarios(Datos)
    })

    // Evento -> modificar mensajes
    ipcRenderer.on("ModificarMensaje",(event,mensaje)=>{
        console.log("MENSAJE: este es el mensaje que llego:")
        console.log(mensaje)
        CargarMensajeUsuarios(mensaje)
    })

    // Evento -> actualizar formulario nuevo cliente
    ipcRenderer.on("EActualizarFormularioNuevoUsuario",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: regresando el mensaje y el formulario nuevo usuario a su estador original")

        // Paso -> regresar el mensaje al estado original
        CargarMensajeUsuarios({tipo:"MensajeNeutro",texto:"Bienvenido!"})

        // Paso -> regresar el formulario nuevo cliente
        CargarFormularioNuevoUsuario()

    })

    // Evento -> mostrar el formulario editar cliente
    ipcRenderer.on("EMostrarFormularioEditarUsuario",(event,usuario)=>{

        // mensaje de flujo
        console.log("MENSAJE: se mostrar el formulario editar usuario, el cliente es:")
        console.log(usuario)

        // Paso -> cargar formulario
        CargarFormularioEditarUsuario(usuario)
        
    })


