const { ipcRenderer } = require("electron")

// Eventos

// Evento -> inicializar ventana
ipcRenderer.on("EInicializarSelectUserWindow", (event, clientes) => {
    // Mensaje de flujo
    console.log("MENSAJE: inicializando la ventana SelectUserWindow");
    console.log("-> La ventana se iniciará con los siguientes clientes");
    console.log(clientes);

    // Obtener el espacio donde se colocará la tabla
    let EspacioTabla = document.getElementById("TablaClientes");

    if (EspacioTabla) {
        // Agregar el input de búsqueda (sin botón)
        let buscadorHTML = `
                <div class="search-container">
                    <input type="text" id="BuscarInput" placeholder=" Buscar cliente por nombre o apellido...">
                </div>
            `;

        // Construir la tabla
        let tablaHTML = `<div id="TablaContainer"></div>`;

        // Insertar los elementos en la interfaz
        EspacioTabla.innerHTML = buscadorHTML + tablaHTML;

        // Función para renderizar la tabla con los clientes filtrados
        function renderizarTabla(listaClientes) {
            let tablaHTML = `
                    <table class="Tabla">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

            if (listaClientes.length === 0) {
                tablaHTML += `
                        <tr>
                            <td colspan="3" class="empty-state">
                                <div class="empty-state-icon">🔍</div>
                                <div>No se encontraron clientes</div>
                            </td>
                        </tr>
                    `;
            } else {
                listaClientes.forEach((cliente, index) => {
                    tablaHTML += `
                            <tr class="fila-cliente" data-index="${index}">
                                <td>${index + 1}</td>
                                <td>${cliente.Nombres}</td>
                                <td>${cliente.Apellidos || '-'}</td>
                            </tr>
                        `;
                });
            }

            tablaHTML += `</tbody></table>`;

            // Reemplazar contenido de la tabla
            document.getElementById("TablaContainer").innerHTML = tablaHTML;

            // Agregar evento a cada fila para capturar la selección del usuario
            let filas = document.querySelectorAll(".fila-cliente");
            filas.forEach(fila => {
                fila.addEventListener("click", (event) => {
                    let index = event.currentTarget.getAttribute("data-index");
                    let clienteSeleccionado = listaClientes[index];
                    console.log("Cliente seleccionado:", clienteSeleccionado);
                    ipcRenderer.send("EClienteSeleccionado", clienteSeleccionado)
                });
            });
        }

        // Renderizar la tabla con todos los clientes inicialmente
        renderizarTabla(clientes);

        // Búsqueda en tiempo real mientras se escribe
        document.getElementById("BuscarInput").addEventListener("input", (event) => {
            let textoBusqueda = event.target.value.trim().toLowerCase();

            if (textoBusqueda === "") {
                renderizarTabla(clientes);
                return;
            }

            let regex = new RegExp(textoBusqueda, "i");
            let clientesFiltrados = clientes.filter(cliente =>
                regex.test(cliente.Nombres) || regex.test(cliente.Apellidos)
            );
            renderizarTabla(clientesFiltrados);
        });

        // Enfocar automáticamente el input de búsqueda
        document.getElementById("BuscarInput").focus();
    }
});
