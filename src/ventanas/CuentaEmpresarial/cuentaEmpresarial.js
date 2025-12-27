const { ipcRenderer } = require("electron")

// Variables

// componentes
const { CargarEncabezado } = require("./EncabezadoCE.js")
const { CargarTablaDiarios } = require("./TablaDiarios.js")
const { MostrarDetalleCuentaEmpresarial } = require("./DetalleCuentaEmpresarial.js")
const { CargarTablaMovimientosEmpresariales } = require("./TablaMovimientosEmpresariales.js")

// codigo -> falta cambiar el ID no puede ser VentanaClientes, hace confundir
//<div id="VentanaClientes">
let codigo = `
            <div id="VentanaClientes">
                <div class="AreaEncabezado" id="EspacioEncabezadoCuentaEmpresarial"></div>
                <div class="AreaCuerpo">
                    <div class="CuerpoIzquierdo">
                        <div class="EspacioCuentaEmpresarial" id="EspacioCuentaEmpresarial"></div>
                        <div class="EspacioResumen" id="EspacioResumen"></div>
                        <div class="EspacioDiario" id="EspacioDiario"></div>
                    </div>
                </div>
            </div>
        `

// FUNCIONES

// Funcion -> cargar estructura inicial
function CargarEstructuraInicial() {
    // Paso -> obtener el espacio
    let EspacioGestionarCuentaEmpresarial = document.getElementById("EspacioContenido")
    // Paso -> insertar codigo
    if (EspacioGestionarCuentaEmpresarial) {// no hay error
        EspacioGestionarCuentaEmpresarial.innerHTML = codigo
        console.log("MENSAJE -> se pudo obtener el espacio de gestion cuenta empresarial")
    } else {// si har error
        console.log("ERROR -> no se pudo obtener el espacio de gestion cuenta empresarial")
    }
}

// EVENTOS

// Evento -> inicializar ventana cuenta empresarial
ipcRenderer.on("EInicializarVentanaCuentaEmpresarial", (event, datos) => {
    // mensaje de flujo
    console.log("MENSAJE: quiere gestionar cuenta empresarial")
    console.log("Capital Economico: " + datos.CapitalEconomico)
    console.log("Capital Material: " + datos.CapitalMaterial)
    // Paso -> cargar el codigo o estructura incial
    CargarEstructuraInicial()
    // Paso -> cargar encabezado
    CargarEncabezado()
    // Paso -> cargar tabla diarios
    CargarTablaDiarios(datos.diarios, datos.fecha, datos.CapitalEconomico, datos.CapitalMaterial)
    // Paso -> cargar el detalle de la cuenta
    MostrarDetalleCuentaEmpresarial(datos.CapitalEconomico, datos.CapitalMaterial, datos.rolUsuario)
})

// Evento -> cargar tabla de movimientos empresariales
ipcRenderer.on("ECargarTablaMovimientosEmpresariales", (event, movimientos) => {
    console.log("MENSAJE: cargando tabla de movimientos empresariales")
    CargarTablaMovimientosEmpresariales(movimientos)
})

