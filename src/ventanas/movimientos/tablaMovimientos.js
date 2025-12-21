// Función -> cargar la tabla con todos los movimientos
// Función -> cargar la tabla con todos los movimientos
function CargarTablaMovimientos(movimientos) {
    // Mensaje de flujo
    console.log("MENSAJE: Cargando el componente tabla movimientos");
    console.log("MENSAJE: Llegaron estos movimientos:");
    console.log(movimientos);

    let codigo = ""; // Se define dentro de la función para evitar problemas de sobrescritura
    let totalMovimientos = 0; // Variable para almacenar el total

    if (movimientos && movimientos.length > 0) {
        console.log("MENSAJE: Se encontraron movimientos, generando tabla...");

        // Construcción del código HTML para la tabla
        codigo = `
            <table class="Tabla tabla-movimientos">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Importe</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        movimientos.forEach((movimiento, index) => {
            let numeroFila = String(index + 1).padStart(2, '0');
            let datosMovimiento = JSON.stringify(movimiento);

            // Calcular el total
            let importe = parseFloat(movimiento.Importe) || 0;
            if (movimiento.Tipo.toLowerCase() === "ingreso") {
                totalMovimientos += importe;
            } else if (movimiento.Tipo.toLowerCase() === "retiro") {
                totalMovimientos -= importe;
            }

            // Mensaje de flujo
            console.log("Este es el movimiento que se pondrá en la tabla: ");
            console.log(datosMovimiento);

            codigo += `
                <tr data-info='${datosMovimiento}'>
                    <td>${numeroFila}</td>
                    <td class="tipo-movimiento">${movimiento.Tipo}</td>
                    <td class="fecha-movimiento">${movimiento.Fecha}</td>
                    <td class="cliente-movimiento">${movimiento.ClienteNombres}</td>
                    <td class="importe-movimiento">${movimiento.Importe}</td>
                    <td class="opciones">
                        <button class="BotonOpcion OpcionEliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                        <button class="BotonOpcion OpcionVer" title="Imprimir"><i class="bi bi-printer-fill"></i></button>
                    </td>
                </tr>
            `;
        });

        // Agregar fila del total
        codigo += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align:right; font-weight:bold;">Total:</td>
                        <td id="total-movimientos" style="font-weight:bold;">${totalMovimientos.toFixed(2)}</td>
                        <td><button class="Boton" id="BotonDescargarTabla"> <i class="bi bi-download"></i> Descargar</button></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        `;
    } else {
        console.log("ERROR: No hay movimientos para mostrar");

        // Se muestra un mensaje de "no hay movimientos"
        codigo = `
            <div>
                <p>No hay movimientos</p>
            </div>
        `;
    }

    // Se obtiene el espacio donde se insertará la tabla
    let EspacioTablaMovimientos = document.getElementById("EspacioTablaMovimientos");

    if (EspacioTablaMovimientos) {
        // Se inserta el código HTML en el DOM
        EspacioTablaMovimientos.innerHTML = codigo;

        // Se usa setTimeout para asegurar que el DOM se actualice antes de agregar eventos
        setTimeout(() => {
            // Asignar eventos de impresión / ver detalle
            document.querySelectorAll(".OpcionVer").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosMovimiento = fila.getAttribute("data-info");

                    try {
                        let movimientoObjeto = JSON.parse(datosMovimiento);

                        if (typeof ipcRenderer !== "undefined") {
                            // Enviar a impresión o vista previa
                            ipcRenderer.send("EImprimirMovimiento", movimientoObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del movimiento a objeto:", error);
                    }
                });
            });

            // Asignar eventos de impresión / ver detalle

            document.getElementById("BotonDescargarTabla").addEventListener("click", () => {
                ipcRenderer.send("EDescargarTablaMovimientos", movimientos);
            })

            // Asignar eventos de eliminación
            document.querySelectorAll(".OpcionEliminar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosMovimiento = fila.getAttribute("data-info");

                    try {
                        let movimientoObjeto = JSON.parse(datosMovimiento);

                        if (typeof ipcRenderer !== "undefined") {
                            // Obtener fechas del filtro
                            let fechaInicio = document.getElementById("CampoTextoFechaInicial") ? document.getElementById("CampoTextoFechaInicial").value : "";
                            let fechaFinal = document.getElementById("CampoTextoFechaFinal") ? document.getElementById("CampoTextoFechaFinal").value : "";

                            let datosEnvio = {
                                movimiento: movimientoObjeto,
                                filtro: {
                                    fechaInicio: fechaInicio,
                                    fechaFinal: fechaFinal,
                                    cliente: document.getElementById("CampoClienteMovimientoBuscador") ? document.getElementById("CampoClienteMovimientoBuscador").value : "todos"
                                }
                            };
                            ipcRenderer.send("EEliminarMovimiento", datosEnvio);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del movimiento a objeto:", error);
                    }
                });
            });

            console.log("Eventos de botones asignados correctamente.");
        }, 100);
    } else {
        console.log("ERROR: No se pudo obtener el espacio de la tabla movimientos");
    }
}

module.exports = {
    CargarTablaMovimientos
};
