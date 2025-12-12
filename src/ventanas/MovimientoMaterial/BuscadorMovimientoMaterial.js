// Variables

const { ipcRenderer } = require("electron");

// codigo
let codigo = ``

// Funciones

// Funcion -> mapear los clientes
function ModificarCodigo(clientes, fecha) {

    console.log("Buscador: fecha: ", fecha)
    // Generar opciones dinámicamente
    let opcionesClientes = clientes.map(cliente => `<option value="${cliente.ID}">${cliente.Nombres}</option>`).join("");

    // Generar el código con las opciones de clientes mapeadas
    codigo = `
            <div class="Buscador"> 
                <div class="Buscadores">
                    <div class="BuscadorUnico">
                        <p>Fecha Inicial:</p>
                        <input id="CampoTextoFechaInicial" value="${fecha}" type="date">
                    </div>
                    <div class="BuscadorUnico">
                        <p>Fecha Final:</p>
                        <input id="CampoTextoFechaFinal" value="${fecha}" type="date">
                    </div>
                    <div class="BuscadorUnico">
                        <p>Cliente:</p>
                        <select id="CampoClienteMovimientoBuscador" name="cliente">
                            <option value="todos">todos</option>
                            ${opcionesClientes}
                        </select>
                    </div>
                </div>
                <div class="Botones">
<button class="Boton" id="BotonBuscar" title="Buscar"><i class="bi bi-search"></i></button>
                </div>
            </div>
        `;
}

// Funcion -> filtrar los movimientos
function FiltrarMovimientos() {

    // mensaje de flujo
    console.log("filtrando los movimientos existentes")
    datosFiltro = {
        "cliente": document.getElementById("CampoClienteMovimientoBuscador").value,
        "fechaInicio": document.getElementById("CampoTextoFechaInicial").value,
        "fechaFinal": document.getElementById("CampoTextoFechaFinal").value
    }
    console.log(datosFiltro)

    // Paso -> enviar el evento
    ipcRenderer.send("EFiltrarMovimientosMateriales", datosFiltro)

}


// Funcion -> cargar buscador de clientes
function MostrarBuscadorMovimientoMaterial(clientes, fecha) {

    // mensaje de flujo
    console.log("MENSAJE: cargando el componente buscador de movimiento")

    // Paso -> obtener el espacio
    let EspacioBuscadorMovimiento = document.getElementById("EspacioBuscadorMovimiento")
    if (EspacioBuscadorMovimiento) {
        // Paso -> modificar codigo
        ModificarCodigo(clientes, fecha)
        // Paso -> ingresar el codigo html
        EspacioBuscadorMovimiento.innerHTML = codigo
        // Paso -> agregar la funcionalidad del boton buscar
        document.getElementById("BotonBuscar").addEventListener("click", FiltrarMovimientos)
        /* document.getElementById("BuscadorBotonSelectCliente").addEventListener("click",()=>{
            // mensaje de flujo
            console.log("MENSAJE: se quiere seleccionar un cliente")
            // Paso -> actualizar formulario nuevo cliente
            ipcRenderer.send("EQuiereSeleccionarCliente")
        }) */
    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo encontrar el espacio para gargar el buscador movimiento")
    }
}

module.exports = { MostrarBuscadorMovimientoMaterial };