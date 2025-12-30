const { ipcRenderer } = require("electron");

// Variables
let DatosActuales = null;

// Función -> generar HTML para movimientos económicos
function GenerarTablaMovimientosEconomicos(movimientos) {
    if (!movimientos || movimientos.length === 0) {
        return '<p class="MensajeVacio">No hay movimientos económicos para esta fecha</p>';
    }

    let filas = movimientos.map(mov => {
        const tipoUpper = (mov.Tipo || '').toUpperCase();
        const badgeClass = tipoUpper === 'INGRESO' ? 'ingreso' : 'egreso';
        return `
            <tr>
                <td>${mov.Fecha}</td>
                <td>${mov.Hora || 'N/A'}</td>
                <td><span class="BadgeTipo ${badgeClass}">${mov.Tipo}</span></td>
                <td>${mov.ClienteN || mov.ClienteNombres || 'N/A'}</td>
                <td>S/. ${mov.Importe || '0.00'}</td>
                <td>${mov.Observacion || ''}</td>
            </tr>
        `;
    }).join('');

    return `
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Importe</th>
                    <th>Observación</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

// Función -> generar HTML para movimientos materiales
function GenerarTablaMovimientosMateriales(movimientos) {
    if (!movimientos || movimientos.length === 0) {
        return '<p class="MensajeVacio">No hay movimientos materiales para esta fecha</p>';
    }

    let filas = movimientos.map(mov => {
        const tipoUpper = (mov.Tipo || '').toUpperCase();
        const badgeClass = tipoUpper === 'INGRESO' ? 'ingreso' : 'egreso';
        return `
            <tr>
                <td>${mov.Fecha}</td>
                <td>${mov.Hora || 'N/A'}</td>
                <td><span class="BadgeTipo ${badgeClass}">${mov.Tipo}</span></td>
                <td>${mov.ClienteN || mov.ClienteNombres || 'N/A'}</td>
                <td>${mov.Peso || '0'} g.</td>
                <td>${mov.Observacion || ''}</td>
            </tr>
        `;
    }).join('');

    return `
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Peso</th>
                    <th>Observación</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

// Función -> generar HTML para ventas ocasionales
function GenerarTablaVentasOcasionales(ventas) {
    if (!ventas || ventas.length === 0) {
        return '<p class="MensajeVacio">No hay ventas ocasionales para esta fecha</p>';
    }

    let filas = ventas.map(venta => {
        const tipoUpper = (venta.Tipo || '').toUpperCase();
        const badgeClass = (tipoUpper === 'COMPRA' || tipoUpper === 'INGRESO') ? 'ingreso' : 'egreso';
        return `
            <tr>
                <td>${venta.Fecha}</td>
                <td>${venta.Hora || 'N/A'}</td>
                <td><span class="BadgeTipo ${badgeClass}">${venta.Tipo}</span></td>
                <td>${venta.ClienteN || venta.ClienteNombres || venta.Cliente || 'N/A'}</td>
                <td>${venta.Peso || '0'} g.</td>
                <td>S/. ${venta.Importe || '0.00'}</td>
            </tr>
        `;
    }).join('');

    return `
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Peso</th>
                    <th>Importe</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

// Función -> generar HTML para movimientos empresariales
function GenerarTablaMovimientosEmpresariales(movimientos) {
    if (!movimientos || movimientos.length === 0) {
        return '<p class="MensajeVacio">No hay movimientos empresariales para esta fecha</p>';
    }

    let filas = movimientos.map((mov, index) => {
        // Formatear el índice para que tenga 2 dígitos (ej: 01, 02)
        let numeroFila = String(index + 1).padStart(2, '0');
        return `
            <tr>
                <td>${numeroFila}</td>
                <td>${mov.Fecha}</td>
                <td>${mov.Hora}</td>
                <td>${mov.Usuario}</td>
                <td>${mov.Tipo}</td>
                <td>${mov.Operacion || ""}</td>
                <td>${mov.Importe}</td>
                <td>${mov.Detalle || ""}</td>
                <td>${mov.CapturaSaldo}</td>
            </tr>
        `;
    }).join('');

    return `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Operación</th>
                    <th>Importe</th>
                    <th>Detalle</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

// Función -> generar HTML completo de la ventana modal
function GenerarVentanaDetalles(datos) {
    console.log("DetallesDia: Generando ventana de detalles con datos:", datos);

    // Filtrar los movimientos por tipo
    const movimientosEconomicos = datos.movimientos.filter(m => m.Registro === "Economico");
    const movimientosMateriales = datos.movimientos.filter(m => m.Registro === "Material");
    const ventasOcasionales = datos.movimientos.filter(m => m.Registro === "VentaOcasional");
    const movimientosEmpresariales = datos.movimientosEmpresariales || [];

    return `
        <div class="DetallesDiaOverlay" id="DetallesDiaOverlay">
            <div class="DetallesDiaContenedor">
                <div class="DetallesDiaHeader">
                    <h2>Movimientos de ${datos.fecha}</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="BotonDescargar" id="BotonDescargarExcel" title="Descargar Excel">
                            <i class="bi bi-download"></i>
                        </button>
                        <button class="CerrarDetalles" id="CerrarDetalles">×</button>
                    </div>
                </div>
                <div class="DetallesDiaBody">
                    <div class="SeccionMovimientos">
                        <h3> Movimientos Económicos</h3>
                        ${GenerarTablaMovimientosEconomicos(movimientosEconomicos)}
                    </div>
                    <div class="SeccionMovimientos">
                        <h3> Movimientos Materiales</h3>
                        ${GenerarTablaMovimientosMateriales(movimientosMateriales)}
                    </div>
                    <div class="SeccionMovimientos">
                        <h3> Ventas Ocasionales</h3>
                        ${GenerarTablaVentasOcasionales(ventasOcasionales)}
                    </div>
                    <div class="SeccionMovimientos">
                        <h3> Movimientos Empresariales</h3>
                        ${GenerarTablaMovimientosEmpresariales(movimientosEmpresariales)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función -> cerrar ventana de detalles
function CerrarVentanaDetalles() {
    const overlay = document.getElementById("DetallesDiaOverlay");
    if (overlay) {
        overlay.remove();
    }
    DatosActuales = null;
}

// Función -> mostrar ventana de detalles
function MostrarDetallesDia(datos) {
    console.log("DetallesDia: Mostrando detalles del día");

    // Guardar datos actuales
    DatosActuales = datos;

    // Obtener el espacio de contenido principal
    const contenedor = document.getElementById("VentanaPrincipal");
    if (!contenedor) {
        console.error("DetallesDia: No se encontró el contenedor principal");
        return;
    }

    // Generar y agregar el HTML
    const html = GenerarVentanaDetalles(datos);
    contenedor.insertAdjacentHTML('beforeend', html);

    // Agregar event listeners
    const botonCerrar = document.getElementById("CerrarDetalles");
    const overlay = document.getElementById("DetallesDiaOverlay");

    if (botonCerrar) {
        botonCerrar.addEventListener('click', CerrarVentanaDetalles);
    }

    const botonDescargar = document.getElementById("BotonDescargarExcel");
    if (botonDescargar) {
        botonDescargar.addEventListener('click', () => {
            console.log("Solicitando exportación de Excel...");
            ipcRenderer.send("EExportarDetallesDia", datos);
        });
    }

    if (overlay) {
        // Cerrar al hacer clic fuera del contenedor
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                CerrarVentanaDetalles();
            }
        });
    }
}

// EVENTOS

// Evento -> recibir datos de detalles del día
ipcRenderer.on("EMostrarDetallesDia", (event, datos) => {
    console.log("DetallesDia: Recibiendo datos de detalles del día:", datos);
    MostrarDetallesDia(datos);
});

// Exportar funciones
module.exports = {
    MostrarDetallesDia,
    CerrarVentanaDetalles
};
