const { ipcRenderer } = require('electron');

// Componentes necesarios
const { CargarMensajeMovimiento } = require('./mensajeMovimientos.js')
const { CargarFormularioNuevoMovimiento } = require('./formularioNuevoMovimiento.js')
const { CargarEncabezado } = require('./headMovimientos.js')
const { CargarBuscadorMovimiento } = require('./buscadorMovimientos.js');
const { CargarTablaMovimientos } = require('./tablaMovimientos.js');

let codigo = `

<div id="VentanaClientes">
    <div class="AreaEncabezado" id="EspacioEncabezadoMovimientos"></div>
    <div class="AreaCuerpo">
        <div class="CuerpoIzquierdo">
            <div class="EspacioBuscador" id="EspacioBuscadorMovimiento"></div>
            <div class="EspacioTabla" id="EspacioTablaMovimientos"></div>
        </div>
        <div class="CuerpoDerecho">
            <div class="EspacioFormulario" id="EspacioFormularioNuevoMovimiento"></div>
            <div class="EspacioMensaje" id="EspacioMensajeMovimiento"></div>
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
            console.log("ERROR: no se pudo obtener el espacio para colocar la ventana gestionar movimientos")
        }
    }

// Eventos
    
    // Evento 1 -> mostrar la ventana
    ipcRenderer.on("EMostrarVentanaGestionarMovimientos",(event,Datos)=>{
    
        // mensaje de flujo
        console.log("MENSAJE: se quiere gestionar movimientos")
        console.log("MENSAJE: se cargaran todos los componentes")
        console.log(Datos)
    
        // Paso -> insertar la estructura inicial
        CargarEstructura()

        // Paso -> cargar el encabezado
        CargarEncabezado()

        // Paso -> cargar buscador movimiento
        CargarBuscadorMovimiento(Datos.clientes,Datos.Fecha)

        // Paso -> cargar la tabla de movimientos
        CargarTablaMovimientos(Datos.movimientos)

        // Paso -> cargar el formulario nuevo movimiento 
        CargarFormularioNuevoMovimiento(Datos.clientes,Datos.usuario)

        // Paso -> cargar los mensajes
        CargarMensajeMovimiento({tipo:"MensajeNeutro",texto:"Bienvenido!"})
    })

    // Evento -> actualizar la tabla movimientos
    ipcRenderer.on("ActualizarTablaMovimientos",(event,Datos)=>{
        console.log("MENSAJE: esta es la tabla movimientos que llego:")
        console.log(Datos)
        CargarTablaMovimientos(Datos)
    })

    // Evento -> modificar mensajes
    ipcRenderer.on("ModificarMensaje",(event,mensaje)=>{
        console.log("MENSAJE: este es el mensaje que llego:")
        console.log(mensaje)
        CargarMensajeMovimiento(mensaje)
    })

    // Evento -> actualizar formulario nuevo cliente
    ipcRenderer.on("EActualizarFormularioNuevoMovimiento",(event,clientes)=>{

        // mensaje de flujo
        console.log("MENSAJE: regresando el mensaje y el formulario nuevo movimiento a su estador original")

        // Paso -> regresar el mensaje al estado original
        CargarMensajeMovimiento({tipo:"MensajeNeutro",texto:"Bienvenido!"})

        // Paso -> regresar el formulario nuevo cliente
        CargarFormularioNuevoMovimiento(clientes)

    })

