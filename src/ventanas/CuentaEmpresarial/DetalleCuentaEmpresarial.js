// Variables

    // codigo
    let Codigo

// Funciones

    // Función -> Generar código
    function GenerarCodigo(CapitalEconomico,CapitalMaterial) {

        // mensaje de flujo
        console.log("DetalleCuentaEmpresarial: generando el código del componente")

        // Paso -> generar codigo HTML
        Codigo = `
            <div class="Capital">
                <p>Capital Economico</p>
                <p class="Tarjeta">${CapitalEconomico} S/.</p>
            </div>
            <div class="Capital">
                <p>Capital Material</p>
                <p class="Tarjeta">${CapitalMaterial} G.</p>
            </div>
        `;

    }

    // Funcion -> cargar el componente resumenCE
    function MostrarDetalleCuentaEmpresarial (CapitalEconomico,CapitalMaterial){

        // mensaje de flujo
        console.log("DetalleCuentaEmpresarial: cargando el componente")
        console.log("CapitalEconomico: ",CapitalEconomico," CapitalMaterial: ",CapitalMaterial)

        // Paso -> obtener el espacio para cargar componente
        let Espacio = document.getElementById("EspacioCuentaEmpresarial")
        if(Espacio){
            //mensaje de flujo
            console.log("DetalleCuentaEmpresarial: se obtubo el espacio para cargar el componente")
            // Paso -> generar codigo
            GenerarCodigo(CapitalEconomico,CapitalMaterial)
            // Paso -> insertar html
            Espacio.innerHTML = Codigo
        }else{
            //mensaje de flujo
            console.log("DetalleCuentaEmpresarial: no se obtubo el espacio para cargar el componente")
        }
    }

module.exports = { MostrarDetalleCuentaEmpresarial };