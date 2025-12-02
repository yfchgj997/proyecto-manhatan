// Variables

// Funciones

// Funcion -> cargar encabezado
function CargarEncabezado() {
    // mensaje de flujo
    console.log("MENSAJE: cargando el componente encabezado de cuenta empresarial")
    // Paso -> obtener el espacio donde colocar el encabezado
    let EspacioEncabezadoCE = document.getElementById("EspacioEncabezadoCuentaEmpresarial")

    let codigo = `
            <div class="Encabezado" style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
                <h1 class="NombreEncabezado">Cuenta Empresarial</h1>
                <button id="BtnVerDetalles" class="BotonCode" style="height: 40px;">Ver detalles</button>
            </div>
        `

    if (EspacioEncabezadoCE) {
        // mensaje de flujo
        console.log("MENSAJE: se pudo obtener el espacio para colocar encabezado cuenta empresarial")
        // Paso -> insertar codigo
        EspacioEncabezadoCE.innerHTML = codigo

        // Agregar evento al botón
        let btnVerDetalles = document.getElementById("BtnVerDetalles")
        if (btnVerDetalles) {
            btnVerDetalles.addEventListener("click", () => {
                const { ipcRenderer } = require("electron")
                ipcRenderer.send("EQuiereVerDetallesMovimientosEmpresariales")
            })
        }

    } else {
        // mensaje de flujo
        console.log("ERROR: no se pudo obtener el espacio para colocar encabezado cuenta empresarial")
    }

}

module.exports = { CargarEncabezado };