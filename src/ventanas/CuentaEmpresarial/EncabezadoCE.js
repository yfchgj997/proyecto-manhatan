// Variables

    // codigo
    let codigo = `
        <div class="Encabezado">
            <h1 class="NombreEncabezado">Cuenta Empresarial</h1>
        </div>
    `

// Funciones

    // Funcion -> cargar encabezado
    function CargarEncabezado (){
        // mensaje de flujo
        console.log("MENSAJE: cargando el componente encabezado de cuenta empresarial")
        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioEncabezadoCE = document.getElementById("EspacioEncabezadoCuentaEmpresarial")
        if(EspacioEncabezadoCE){
            // mensaje de flujo
            console.log("MENSAJE: se pudo obtener el espacio para colocar encabezado cuenta empresarial")
            // Paso -> insertar codigo
            EspacioEncabezadoCE.innerHTML = codigo
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado cuenta empresarial")
        }

    }

module.exports = { CargarEncabezado };