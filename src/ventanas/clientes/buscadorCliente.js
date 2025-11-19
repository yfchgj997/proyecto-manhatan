const { ipcRenderer } = require("electron");

// Variables

    // codigo
    let codigo = `
        <div class="Buscador"> 
            <div class="Buscadores">
                <div class="BuscadorUnico">
                    <p>Nombres:</p>
                    <input id="CampoTextoCliente" placeholder="Buscar por nombre ..." type="text">
                </div>
            </div>
            <div class="Botones">
                <button class="Boton" id="BotonBuscarCliente">Buscar</button>
            </div>
        <div>
    `

// Funciones

    // Funcion -> enviar evento buscar cliente
    function BuscarCliente (){

        // mensaje de flujo
        console.log("MENSAJE: se quiere buscar un cliente")

        // Paso -> obtener datos necesarios
        let dato = document.getElementById("CampoTextoCliente").value

        // Paso -> enviar eventos 
        ipcRenderer.send("EBuscarCliente",dato)

    }

    // Funcion -> cargar buscador de clientes
    function CargarBuscadorCliente (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente buscador de cliente")

        // Paso -> obtener el espacio
        let EspacioBuscadorCliente = document.getElementById("EspacioBuscadorCliente")
        if(EspacioBuscadorCliente){
            // Paso -> ingresar el codigo html
            EspacioBuscadorCliente.innerHTML = codigo 
            // Paso -> agregar la funcionalidad del boton buscar
            document.getElementById("BotonBuscarCliente").addEventListener("click",BuscarCliente)
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo encontrar el espacio para gargar formulario nuevo cliente")
        }
    }

module.exports = { CargarBuscadorCliente };