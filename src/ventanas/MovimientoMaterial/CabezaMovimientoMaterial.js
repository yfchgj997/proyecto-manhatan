// Variables

    // codigo
    let codigo = `
        <div class="Encabezado EncabezadoMovimientos">
            <h1 class="NombreEncabezado">Movimientos Materiales</h1>
        </div>
    `

// Funciones

    // Funcion -> mostrar el encabezado
    function MostrarEncabezado (){

        // mensaje de flujo
        console.log("MM-Encabezado: se cargara el encabezado")

        // Paso -> obtener el espacio donde colocarlo
        let Espacio = document.getElementById("EspacioEncabezadoMovimientoMaterial")
        if(Espacio){
            // Paso -> insertar codigo 
            Espacio.innerHTML = codigo
        }else{
            // mensaje de flujo
            console.log("MM-Encabezado: no se pudo obtener el espacio para colocar el encabezado")   
        }
    }

module.exports = { MostrarEncabezado };