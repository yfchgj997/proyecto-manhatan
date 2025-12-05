const { ipcRenderer } = require('electron');

// VARIABLES

// codigo 
let codigo = `
        <div id="VentanaClientes">
            <div class="AreaEncabezado" id="EspacioEncabezadoVentaDeOro"></div>
            <div class="AreaCuerpo">
                <div class="CuerpoIzquierdo">
                    <div class="EspacioBuscador" id="EspacioBuscadorVentaDeOro"></div>
                    <div class="EspacioTabla" id="EspacioTablaVentaDeOro"></div>
                </div>
                <div class="CuerpoDerecho">
                    <div class="EspacioFormulario" id="EspacioFormularioNuevoVentaDeOro"></div>
                    <div class="EspacioMensaje" id="EspacioMensajeVentaDeOro"></div>
                </div>
            </div>
        </div>
    `
// componentes
const { CargarEncabezado } = require("./VentaDeOroCabeza.js")
const { CargarFormularioNuevoVentaDeOro } = require("./FormularioNuevoVentaDeOro.js")
const { CargarMensajeVentaDeOro } = require("./MensajeVentaDeOro.js")
const { CargarTablaCV } = require("./TablaVentaDeOro.js")
const { CargarBuscadorCV } = require("./BuscadorVentaDeOro.js")

// Funciones

// Funcion -> cargar la estructura de la ventana especificada en codigo
function CargarEstructura() {
    // Paso -> obtener el espacio para colocar la estructura
    let EspacioGestionarVentaDeOro = document.getElementById("EspacioContenido")
    // Paso -> insertar codigo
    if (EspacioGestionarVentaDeOro) {
        EspacioGestionarVentaDeOro.innerHTML = codigo
    } else {
        console.log("ERROR: no se pudo obtener el espacio para colocar la ventana gestionar compra venta")
    }
}

// Eventos

// Evento 1 -> mostrar la ventana
ipcRenderer.on("ECargarComponenteVentaDeOro", (event, datos) => {

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
    CargarFormularioNuevoVentaDeOro(datos.usuarioAutenticado, datos.fecha)
    // Paso -> cargar mensaje venta de oro
    CargarMensajeVentaDeOro({ tipo: "MensajeNeutro", texto: "Bienvenido!" })
    // Paso -> cargar tabla de compra venta
    CargarTablaCV(datos.listaCV)
    // Paso -> cargar buscador
    CargarBuscadorCV(datos.fecha, datos.fecha)

})

// Evento 2 -> modificar el mensaje
ipcRenderer.on("ModificarMensaje", (event, mensaje) => {
    console.log("MENSAJE: este es el mensaje que llego:")
    console.log(mensaje)
    CargarMensajeVentaDeOro(mensaje)
})

// Evento 3 -> actualizar la tabla de compra venta
ipcRenderer.on("EActualizarTablaVentaDeOro", (event, listaCV) => {
    CargarTablaCV(listaCV)
})