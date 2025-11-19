const { ipcRenderer } = require('electron');

// VARIABLES

    // codigo 
    let codigo = `
        <div id="VentanaClientes">
            <div class="AreaEncabezado" id="EspacioEncabezadoCompraVenta"></div>
            <div class="AreaCuerpo">
                <div class="CuerpoIzquierdo">
                    <div class="EspacioBuscador" id="EspacioBuscadorCompraVenta"></div>
                    <div class="EspacioTabla" id="EspacioTablaCompraVenta"></div>
                </div>
                <div class="CuerpoDerecho">
                    <div class="EspacioFormulario" id="EspacioFormularioNuevoCompraVenta"></div>
                    <div class="EspacioMensaje" id="EspacioMensajeCompraVenta"></div>
                </div>
            </div>
        </div>
    `
    // componentes
    const {CargarEncabezado} = require("./CompraVentaCabeza.js")
    const {CargarFormularioNuevoCompraVenta} = require("./FormularioNuevoCompraVenta.js")
    const {CargarMensajeCompraVenta} = require("./MensajeCompraVenta.js")
    const {CargarTablaCV} = require("./TablaCompraVenta.js")
    const {CargarBuscadorCV} = require("./BuscadorCompraVenta.js")

// Funciones

    // Funcion -> cargar la estructura de la ventana especificada en codigo
    function CargarEstructura (){
        // Paso -> obtener el espacio para colocar la estructura
        let EspacioGestionarCompraVenta = document.getElementById("EspacioContenido")
        // Paso -> insertar codigo
        if(EspacioGestionarCompraVenta){
            EspacioGestionarCompraVenta.innerHTML = codigo
        }else{
            console.log("ERROR: no se pudo obtener el espacio para colocar la ventana gestionar compra venta")
        }
    }

// Eventos
    
    // Evento 1 -> mostrar la ventana
    ipcRenderer.on("ECargarComponenteCompraVenta",(event,datos)=>{
    
        // mensaje de flujo
        console.log("MENSAJE: se quiere gestionar compra venta")
        console.log("MENSAJE: eston son los datos que llegaron:")
        console.log(datos)
        console.log("MENSAJE: se cargaran todos los componentes")
    
        // Paso -> insertar la estructura inicial
        CargarEstructura()
        // Paso -> cargar encabezado
        CargarEncabezado()
        // Paso -> cargar formulario nuevo compra venta
        CargarFormularioNuevoCompraVenta(datos.usuarioAutenticado,datos.fecha)
        // Paso -> cargar mensaje compra venta
        CargarMensajeCompraVenta({tipo:"MensajeNeutro",texto:"Bienvenido!"})
        // Paso -> cargar tabla de compra venta
        CargarTablaCV(datos.listaCV)
        // Paso -> cargar buscador
        CargarBuscadorCV(datos.fecha,datos.fecha)

    })

    // Evento 2 -> modificar el mensaje
    ipcRenderer.on("ModificarMensaje",(event,mensaje)=>{
        console.log("MENSAJE: este es el mensaje que llego:")
        console.log(mensaje)
        CargarMensajeCompraVenta(mensaje)
    })

    // Evento 3 -> actualizar la tabla de compra venta
    ipcRenderer.on("EActualizarTablaCompraVenta",(event,listaCV)=>{
        CargarTablaCV(listaCV)
    })