// Variables

const { ipcRenderer } = require("electron");

// codigo
let codigo = ``

// Funciones

// Funcion -> mapear los clientes
function ModificarCodigo(fechaInicial, fechaFinal) {

    // Generar el código con las opciones de clientes mapeadas
    codigo = `
            <div class="Buscador"> 
                <div class="Buscadores">
                    <div class="BuscadorUnico">
                        <p>Fecha Inicial:</p>
                        <input value="${fechaInicial}" id="CampoTextoFechaInicial" type="date">
                    </div>
                    <div class="BuscadorUnico">
                        <p>Fecha Final:</p>
                        <input value="${fechaFinal}" id="CampoTextoFechaFinal" type="date">
                    </div>
                </div>
                <div class="Botones">
                    <button class="Boton" id="BotonBuscar">Buscar</button>
                </div>
            </div>
        `;
}

// Funcion -> filtrar los movimientos
function FiltrarListaCV() {

    // mensaje de flujo
    console.log("filtrando la lista CV existente")
    datosFiltro = {
        "fechaInicio": document.getElementById("CampoTextoFechaInicial").value,
        "fechaFinal": document.getElementById("CampoTextoFechaFinal").value
    }

    // Paso -> enviar el evento
    ipcRenderer.send("EFiltrarListaCV", datosFiltro)

}


// Funcion -> cargar buscador de clientes
function CargarBuscadorCV(fechaInicial, fechaFinal) {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente buscador de CV")

    // Paso -> obtener el espacio
    let EspacioBuscadorCV = document.getElementById("EspacioBuscadorVentaDeOro")
    if (EspacioBuscadorCV) {
        // Paso -> modificar codigo
        ModificarCodigo(fechaInicial, fechaFinal)
        // Paso -> ingresar el codigo html
        EspacioBuscadorCV.innerHTML = codigo
        // Paso -> agregar la funcionalidad del boton buscar
        document.getElementById("BotonBuscar").addEventListener("click", FiltrarListaCV)
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo encontrar el espacio para gargar el buscador CV")
    }
}

module.exports = { CargarBuscadorCV };