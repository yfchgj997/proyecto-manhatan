// Variables

const { ipcRenderer } = require("electron")

    // codigo
    // <button class="Boton BotonEncabezado" id="BotonFormularioNuevoMovimiento">Nuevo</button>
    let codigo = `
        <div class="Encabezado EncabezadoMovimientos">
            <h1 class="NombreEncabezado">Movimientos Economicos</h1>
        </div>
    `

// Funciones

    // Funcion -> cargar encabezado
    function CargarEncabezado (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente encabezado de movimientos")

        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioEncabezadoMovimiento = document.getElementById("EspacioEncabezadoMovimientos")
        if(EspacioEncabezadoMovimiento){
            // Paso -> insertar codigo
            EspacioEncabezadoMovimiento.innerHTML = codigo
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado de movimiento")
        }

    }

module.exports = { CargarEncabezado };