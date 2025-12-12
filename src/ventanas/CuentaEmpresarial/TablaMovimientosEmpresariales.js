const { ipcRenderer } = require("electron");

function GenerarHTML(movimientos) {
    let contenidoMovimientos = "";

    if (!movimientos || movimientos.length === 0) {
        contenidoMovimientos = `
            <p id="SinMovimientos" class="texto-vacio">No hay movimientos registrados</p>
        `;
    } else {
        let filas = movimientos.map(m => {
            return `
                <tr class="fila-movimiento">
                    <td>${m.ID}</td>
                    <td>${m.Fecha}</td>
                    <td>${m.Hora}</td>
                    <td>${m.Usuario}</td>
                    <td>${m.Tipo}</td>
                    <td>${m.Operacion || ""}</td>
                    <td>${m.Importe}</td>
                    <td>${m.Detalle || ""}</td>
                    <td>${m.CapturaSaldo}</td>
                </tr>
            `;
        }).join("");

        contenidoMovimientos = `
            <table id="TablaMovimientos" class="tabla-movimientos" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2; text-align: left;">
                        <th style="padding: 12px;">ID</th>
                        <th style="padding: 12px;">Fecha</th>
                        <th style="padding: 12px;">Hora</th>
                        <th style="padding: 12px;">Usuario</th>
                        <th style="padding: 12px;">Tipo</th>
                        <th style="padding: 12px;">Operación</th>
                        <th style="padding: 12px;">Importe</th>
                        <th style="padding: 12px;">Detalle</th>
                        <th style="padding: 12px;">Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }

    return `
    <div id="MovimientosEmpresarialesContenedor" style="padding: 20px;">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">Detalle de Movimientos Empresariales</h2>
            <button class="BotonCode" id="BotonVolverDeMovimientos" title="Volver"> Volver </button>
        </div>

        <div id="ContenedorMovimientos">
            ${contenidoMovimientos}
        </div>

    </div>
    `;
}

// Función -> cargar la interfaz de movimientos
function CargarTablaMovimientosEmpresariales(movimientos) {

    console.log("MENSAJE: cargando componente Tabla Movimientos Empresariales")

    const EspacioContenido = document.getElementById("EspacioContenido")

    if (!EspacioContenido) {
        console.log("ERROR: no existe el contenedor EspacioContenido")
        return
    }

    // insertar nuevo diseño
    EspacioContenido.innerHTML = GenerarHTML(movimientos)

    setTimeout(() => {
        document.getElementById("BotonVolverDeMovimientos").addEventListener("click", () => {
            ipcRenderer.send("EQuiereGestionarCuentaEmpresarial");
        });
        console.log("Eventos de botones asignados correctamente.");
    }, 100);

}

module.exports = { CargarTablaMovimientosEmpresariales };
