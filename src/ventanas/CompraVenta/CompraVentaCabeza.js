// Variables

    // codigo
    let codigo = `
        <div class="Encabezado">
            <h1 class="NombreEncabezado">Ventas Ocasionales</h1>
        </div>
    `

// Funciones

    // Funcion -> cargar encabezado
    function CargarEncabezado (){
        // mensaje de flujo
        console.log("MENSAJE: cargando el componente encabezado de COMPRA VENTA")
        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioEncabezadoCompraVenta = document.getElementById("EspacioEncabezadoCompraVenta")
        if(EspacioEncabezadoCompraVenta){
            // Paso -> insertar codigo
            EspacioEncabezadoCompraVenta.innerHTML = codigo
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado de COMPRA VENTA")
        }

    }

module.exports = { CargarEncabezado };