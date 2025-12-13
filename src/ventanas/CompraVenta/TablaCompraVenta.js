// Funciones

// Función -> cargar la tabla con todos los clientes
function CargarTablaCV(ListaCV) {
    // Mensaje de flujo
    console.log("MENSAJE: Cargando el componente tabla de Compras/Ventas");
    console.log("MENSAJE: Llegaron estos registros:");
    console.log(ListaCV);

    let codigo = ""; // Código HTML de la tabla

    if (ListaCV && ListaCV.length > 0) {
        console.log("MENSAJE: Se encontraron registros, generando tabla...");

        // Construcción del código HTML para la tabla
        codigo = `
                <table class="Tabla tabla-cv">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Monto Material</th>
                            <th>Precio Cambio</th>
                            <th>Monto Económico</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

        ListaCV.forEach((item, index) => {
            let numeroFila = String(index + 1).padStart(2, '0');
            let datosCV = JSON.stringify(item);

            // Mensaje de flujo
            console.log("Este es el registro que se pondrá en la tabla:");
            console.log(datosCV);

            codigo += `
                    <tr data-info='${datosCV}'>
                        <td>${numeroFila}</td>
                        <td>${item.Tipo}</td>
                        <td>${item.Fecha}</td>
                        <td>${item.Hora}</td>
                        <td>${item.Cliente || 'N/A'}</td>
                        <td>${item.MontoMaterial}</td>
                        <td>${item.PrecioCambio}</td>
                        <td>${item.MontoEconomico}</td>
                        <td class="opciones">
                            <button class="BotonOpcion OpcionEliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                            <button class="BotonOpcion OpcionVer" title="Imprimir"><i class="bi bi-printer-fill"></i></button>
                        </td>
                    </tr>
                `;
        });

        codigo += `
                    </tbody>
                </table>
            `;
    } else {
        console.log("ERROR: No hay registros para mostrar");

        // Mostrar mensaje cuando no hay registros
        codigo = `
                <div>
                    <p>No hay registros de Compras/Ventas</p>
                </div>
            `;
    }

    // Se obtiene el espacio donde se insertará la tabla
    let EspacioTablaCV = document.getElementById("EspacioTablaCompraVenta");

    if (EspacioTablaCV) {
        // Se inserta el código HTML en el DOM
        EspacioTablaCV.innerHTML = codigo;

        // Se usa setTimeout para asegurar que el DOM se actualice antes de agregar eventos
        setTimeout(() => {
            document.querySelectorAll(".OpcionVer").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosCV = fila.getAttribute("data-info");

                    try {
                        let CVObjeto = JSON.parse(datosCV);
                        if (typeof ipcRenderer !== "undefined") {
                            console.log("MENSAJE: enviando un evento para editar con el siguiente registro:");
                            console.log(CVObjeto);
                            ipcRenderer.send("EQuiereImprimirCV", CVObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos a objeto:", error);
                    }
                });
            });

            document.querySelectorAll(".OpcionEliminar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosCV = fila.getAttribute("data-info");
                    try {
                        let CVObjeto = JSON.parse(datosCV);

                        if (typeof ipcRenderer !== "undefined") {
                            ipcRenderer.send("EEliminarCV", CVObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos a objeto:", error);
                    }
                });
            });

            console.log("Eventos de botones asignados correctamente.");
        }, 100);
    } else {
        console.log("ERROR: No se pudo obtener el espacio de la tabla de Compras/Ventas");
    }
}


module.exports = {
    CargarTablaCV
};
