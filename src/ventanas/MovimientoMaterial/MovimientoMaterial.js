const { ipcRenderer } = require('electron');

// Componentes necesarios
const { MostrarEncabezado } = require("./CabezaMovimientoMaterial.js")
const { MostrarFormularioNuevoMovimientoMaterial } = require("./FormularioNuevoMovimientoMaterial.js")
const { MostrarBuscadorMovimientoMaterial } = require("./BuscadorMovimientoMaterial.js")
const { MostrarTablaMovimientos } = require("./TablaMovimientosMateriales.js")

let codigo = `

<div id="VentanaClientes">
    <div class="AreaEncabezado" id="EspacioEncabezadoMovimientoMaterial"></div>
    <div class="AreaCuerpo">
        <div class="CuerpoIzquierdo">
            <div class="EspacioBuscador" id="EspacioBuscadorMovimiento"></div>
            <div class="EspacioTabla" id="EspacioTablaMovimientosMateriales"></div>
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
        let Espacio = document.getElementById("EspacioContenido")
        // Paso -> insertar codigo
        if(Espacio){
            Espacio.innerHTML = codigo
        }else{
            console.log("MM: no se pudo obtener el espacio para colocar la ventana")
        }
    }

// Eventos
    
    // Evento 1 -> mostrar la ventana
    ipcRenderer.on("EMostrarVentanaGestionarMovimientosMateriales",(event,Datos)=>{
    
        // mensaje de flujo
        console.log("MM: se quiere gestionar movimientos materiales")
        console.log("MM: tengo estos datos: ")
        console.log(Datos)
    
        // Paso -> insertar la estructura inicial
        CargarEstructura()

        // Paso -> cargar el encabezado
        MostrarEncabezado()

        // Paso -> cargar formulario
        MostrarFormularioNuevoMovimientoMaterial(Datos.ListaClientes,Datos.UsuarioAutenticado,Datos.Fecha)

        // Paso -> mostrar el buscador
        MostrarBuscadorMovimientoMaterial(Datos.ListaClientes,Datos.Fecha)

        // Paso -> cargar tabla
        MostrarTablaMovimientos(Datos.ListaMovimientosMateriales)

    })

    // Evento -> actualizar la tabla movimientos
    ipcRenderer.on("ActualizarTablaMovimientosMateriales",(event,Datos)=>{
        console.log("MENSAJE: esta es la tabla movimientos que llego:")
        console.log(Datos)
        MostrarTablaMovimientos(Datos)
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

