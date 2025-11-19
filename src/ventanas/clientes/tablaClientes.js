// Variables

// Funciones

// Función -> cargar la tabla con todos los clientes
function CargarTablaClientes(clientes) {
    // Mensaje de flujo
    console.log("MENSAJE: Cargando el componente tabla clientes");
    console.log("MENSAJE: Llegaron estos clientes:");
    console.log(clientes);

    let codigo = ""; // Se define dentro de la función para evitar problemas de sobrescritura

    if (clientes && clientes.length > 0) {
        console.log("MENSAJE: Se encontraron clientes, generando tabla...");

        // Construcción del código HTML para la tabla
        codigo = `
            <table class="Tabla tabla-usuarios">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Nombres y Apellidos</th>
                        <th>DNI</th>
                        <th>Dinero</th>
                        <th>Material</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        clientes.forEach((cliente, index) => {
            let numeroFila = String(index + 1).padStart(2, '0');
            let datosCliente = JSON.stringify(cliente); // Se pasa el objeto cliente directamente
        
            // mensaje de flujo
            console.log("Este es el cliente que se pondra en la tabla: ")
            console.log(datosCliente)

            codigo += `
                <tr data-info='${datosCliente}'>
                    <td>${numeroFila}</td>
                    <td class="nombre-usuario">${cliente.Nombres} ${cliente.Apellidos}</td>
                    <td class="cargo-usuario">${cliente.DNI}</td>
                    <td class="saldo-economico">${cliente.SaldoEconomico}</td>
                    <td class="saldo-material">${cliente.SaldoMaterial}</td>
                    <td class="opciones">
                        <button class="BotonOpcion OpcionEditar">e</button>
                        <button class="BotonOpcion OpcionEliminar">-</button>
                    </td>
                </tr>
            `;
        });

        codigo += `
                </tbody>
            </table>
        `;
    } else {
        // Mensaje de flujo
        console.log("ERROR: No hay clientes para mostrar");

        // Se muestra un mensaje de "no hay clientes"
        codigo = `
            <div>
                <p>No hay clientes</p>
            </div>
        `;
    }

    // Se obtiene el espacio donde se insertará la tabla
    let EspacioTablaClientes = document.getElementById("EspacioTablaClientes");

    if (EspacioTablaClientes) {
        // Se inserta el código HTML en el DOM
        EspacioTablaClientes.innerHTML = codigo;

        // Se usa setTimeout para asegurar que el DOM se actualice antes de agregar eventos
        setTimeout(() => {
            document.querySelectorAll(".OpcionEditar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosCliente = fila.getAttribute("data-info");
                    
                    try {
                        let clienteObjeto = JSON.parse(datosCliente);
                        
                        if (typeof ipcRenderer !== "undefined") {
                            // mensaje de flujo
                            console.log("MENSAJE: enviando un evento de mostrar formulario con el siguiente cliente:")
                            console.log(clienteObjeto)
                            ipcRenderer.send("EQuiereFormularioEditarCliente", clienteObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del cliente a objeto:", error);
                    }
                });
            });

            document.querySelectorAll(".OpcionEliminar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosCliente = fila.getAttribute("data-info");

                    try {
                        let clienteObjeto = JSON.parse(datosCliente);
                        
                        if (typeof ipcRenderer !== "undefined") {
                            ipcRenderer.send("EEliminarCliente", clienteObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del cliente a objeto:", error);
                    }
                });
            });

            console.log("Eventos de botones asignados correctamente.");
        }, 100);
    } else {
        console.log("ERROR: No se pudo obtener el espacio de la tabla clientes");
    }
}

module.exports = {
    CargarTablaClientes
};
