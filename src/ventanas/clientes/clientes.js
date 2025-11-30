const { ipcRenderer } = require('electron');

// Componentes necesarios
const { CargarEncabezado } = require('./headclientes.js')
const { CargarFormularioNuevoCliente } = require('./formularioNuevoCliente.js')
const { CargarFormularioEditarCliente } = require('./formularioEditarCliente.js')
const { CargarBuscadorCliente } = require('./buscadorCliente.js')
const { CargarTablaClientes } = require('./tablaClientes.js')
const { CargarMensajeCliente } = require('./mensajeClientes.js')
const { CargarEstadoDeCuentaCliente } = require('./estadoDeCuenta.js')

let codigo = `

<div id="VentanaClientes">
    <div class="AreaEncabezado" id="EspacioEncabezadoCliente"></div>
    <div class="AreaCuerpo">
        <div class="CuerpoIzquierdo">
            <div class="EspacioBuscador" id="EspacioBuscadorCliente"></div>
            <div class="EspacioTabla" id="EspacioTablaClientes"></div>
        </div>
        <div class="CuerpoDerecho">
            <div class="EspacioFormulario" id="EspacioFormularioNuevoCliente"></div>
            <div class="EspacioMensaje" id="EspacioMensajeCliente"></div>
        </div>
    </div>
</div>
`
// Funciones

// Funcion -> cargar la estructura de la ventana especificada en codigo
function CargarEstructura() {

    // Paso -> obtener el espacio para colocar la estructura
    let EspacioGestionarClientes = document.getElementById("EspacioContenido")
    // Paso -> insertar codigo
    if (EspacioGestionarClientes) {
        EspacioGestionarClientes.innerHTML = codigo
    } else {
        console.log("ERROR: no se pudo obtener el espacio para colocar la ventana gestionar clientes")
    }
}

// Eventos

// Evento 1 -> mostrar la ventana
ipcRenderer.on("EMostrarVentanaGestionarClientes", (event, Datos) => {

    // mensaje de flujo
    console.log("MENSAJE: se quiere gestionar clientes")
    console.log("MENSAJE: se cargaran todos los componentes")

    // Paso -> insertar la estructura inicial
    CargarEstructura()

    // Paso -> cargar el componente cabezera o head
    CargarEncabezado()

    // Paso -> cargar el formulario nuevo cliente
    CargarFormularioNuevoCliente()

    // Paso -> cargar el buscador de clientes
    CargarBuscadorCliente()

    // Paso -> cargar la tabla clientes
    CargarTablaClientes([])

    // Paso -> cargar los mensajes
    CargarMensajeCliente({ tipo: "MensajeNeutro", texto: "Bienvenido!" })
})

// Evento -> actualizar la tabla clientes
ipcRenderer.on("ActualizarTablaClientes", (event, Datos) => {
    console.log("MENSAJE: esta es la tabla clientes que llego:")
    console.log(Datos)
    CargarTablaClientes(Datos)
})

// Evento -> modificar mensajes
ipcRenderer.on("ModificarMensaje", (event, mensaje) => {
    console.log("MENSAJE: este es el mensaje que llego:")
    console.log(mensaje)
    CargarMensajeCliente(mensaje)
})

// Evento -> actualizar formulario nuevo cliente
ipcRenderer.on("EActualizarFormularioNuevoCliente", (event) => {

    // mensaje de flujo
    console.log("MENSAJE: regresando el mensaje y el formulario nuevo cliente a su estador original")

    // Paso -> regresar el mensaje al estado original
    CargarMensajeCliente({ tipo: "MensajeNeutro", texto: "Bienvenido!" })

    // Paso -> regresar el formulario nuevo cliente
    CargarFormularioNuevoCliente()

})

// Evento -> mostrar el formulario editar cliente
ipcRenderer.on("EMostrarFormularioEditarCliente", (event, cliente) => {

    // mensaje de flujo
    console.log("MENSAJE: se mostrar el formulario editar cliente, el cliente es:")
    console.log(cliente)

    // Paso -> cargar formulario
    CargarFormularioEditarCliente(cliente)

})

// Evento -> cargar el estado de cuenta del cliente
ipcRenderer.on("CargarEstadoDeCuenta", (event, cliente) => {

    console.log("**MENSAJE: ejecutando FCargarEstadoDeCuenta")
    console.log(cliente)

    // Paso -> cargar el componente de estado de cuenta
    CargarEstadoDeCuentaCliente(cliente)
})
