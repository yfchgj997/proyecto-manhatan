const { ipcRenderer } = require("electron");

function GenerarHTML(movimientos) {
    let contenidoMovimientos = "";

    if (!movimientos || movimientos.length === 0) {
        contenidoMovimientos = `
            <p id="SinMovimientos" class="texto-vacio">No hay movimientos registrados</p>
        `;
    } else {
        let filas = movimientos.map((m, index) => {
            let ecoInicial = "-", ecoFinal = "-", matInicial = "-", matFinal = "-";
            let saldo = parseFloat(m.CapturaSaldo);
            let importe = parseFloat(m.Importe);
            let inicial = 0;

            if (m.Operacion === "Aumentar") {
                inicial = saldo - importe;
            } else {
                inicial = saldo + importe;
            }

            if (m.Tipo === "Capital") {
                ecoInicial = inicial.toFixed(2);
                ecoFinal = saldo.toFixed(2);
            } else if (m.Tipo === "Material") {
                matInicial = inicial.toFixed(2);
                matFinal = saldo.toFixed(2);
            }

            // Convertir "Capital" a "Economico" para mostrar
            let tipoMostrar = m.Tipo === "Capital" ? "Economico" : m.Tipo;

            return `
                <tr class="fila-movimiento">
                    <td>${index + 1}</td>
                    <td>${m.Fecha}</td>
                    <td>${tipoMostrar}</td>
                    <td>${m.Operacion || ""}</td>
                    <td>${m.Importe}</td>
                    <td>${ecoInicial}</td>
                    <td>${ecoFinal}</td>
                    <td>${matInicial}</td>
                    <td>${matFinal}</td>
                </tr>
            `;
        }).join("");

        contenidoMovimientos = `
            <table id="TablaMovimientos" class="tabla-movimientos" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2; text-align: left;">
                        <th style="padding: 12px;">N°</th>
                        <th style="padding: 12px;">Fecha</th>
                        <th style="padding: 12px;">Tipo</th>
                        <th style="padding: 12px;">Operación</th>
                        <th style="padding: 12px;">Importe</th>
                        <th style="padding: 12px;">Cap. Eco. Inicial</th>
                        <th style="padding: 12px;">Cap. Eco. Final</th>
                        <th style="padding: 12px;">Cap. Mat. Inicial</th>
                        <th style="padding: 12px;">Cap. Mat. Final</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }

    return `
    <div id="VentanaClientes">
        <div class="AreaEncabezado">
            <div class="Encabezado">
                <h2 style="margin: 0;">Detalle de Movimientos Empresariales</h2>
                <div style="display: flex; gap: 10px;">
                    <button class="BotonCode" id="BotonExportarExcel" style="background-color: #217346;">Exportar Excel</button>
                    <button class="BotonCode" id="BotonVolverDeMovimientos">Volver</button>
                </div>
            </div>
        </div>

        <div class="AreaCuerpo">
            <div class="CuerpoIzquierdo">
                <div id="ContenedorMovimientos" style="height: 100%; overflow-y: auto; border: 1px solid #ddd; margin-bottom: 10px;">
                    ${contenidoMovimientos}
                </div>
            </div>
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

        document.getElementById("BotonExportarExcel").addEventListener("click", () => {
            ipcRenderer.send("EQuiereExportarMovimientosEmpresariales");
        });
        console.log("Eventos de botones asignados correctamente.");
    }, 100);

}

module.exports = { CargarTablaMovimientosEmpresariales };
