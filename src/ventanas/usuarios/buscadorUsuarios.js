const { ipcRenderer } = require("electron");

// Variables

    // codigo
    let codigo = `
        <div class="Buscador"> 
            <div class="Buscadores">
                <div class="BuscadorUnico">
                    <p>Nombres:</p>
                    <input id="CampoTextoUsuario" placeholder="Buscar por nombre ..." type="text">
                </div>
            </div>
            <div class="Botones">
                <button class="Boton" id="BotonBuscarUsuario">Buscar</button>
            </div>
        <div>
    `

// Funciones

    // Funcion -> enviar evento buscar usuario
    function BuscarUsuario (){

        // mensaje de flujo
        console.log("MENSAJE: se quiere buscar un usuario")

        // Paso -> obtener datos necesarios
        let dato = document.getElementById("CampoTextoUsuario").value

        // Paso -> enviar eventos 
        ipcRenderer.send("EBuscarUsuario",dato)

    }

    // Funcion -> cargar buscador de clientes
    function CargarBuscadorUsuarios (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente buscador de usuarios")

        // Paso -> obtener el espacio
        let EspacioBuscadorUsuario = document.getElementById("EspacioBuscadorUsuarios")
        if(EspacioBuscadorUsuario){
            // Paso -> ingresar el codigo html
            EspacioBuscadorUsuario.innerHTML = codigo 
            // Paso -> agregar la funcionalidad del boton buscar
            document.getElementById("BotonBuscarUsuario").addEventListener("click",BuscarUsuario)
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo encontrar el espacio para gargar buscador usuarios")
        }
    }

module.exports = { CargarBuscadorUsuarios };