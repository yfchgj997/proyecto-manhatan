const {ipcRenderer} = require("electron")

// Eventos

    // Evento -> inicializar ventana
    // Evento -> inicializar ventana
    ipcRenderer.on("EInicializarSelectUserWindow", (event, clientes) => {
        // Mensaje de flujo
        console.log("MENSAJE: inicializando la ventana SelectUserWindow");
        console.log("--> La ventana se iniciará con los siguientes clientes");
        console.log(clientes);

        // Obtener el espacio donde se colocará la tabla
        let EspacioTabla = document.getElementById("TablaClientes");

        if (EspacioTabla) {
            // Agregar el input de búsqueda y el botón
            let buscadorHTML = `
                <input type="text" id="BuscarInput" placeholder="Buscar usuario...">
                <button id="BuscarBtn">Buscar</button>
            `;

            // Construir la tabla (se actualiza con la función renderizarTabla)
            let tablaHTML = `<div id="TablaContainer"></div>`;

            // Insertar los elementos en la interfaz
            EspacioTabla.innerHTML = buscadorHTML + tablaHTML;

            // Función para renderizar la tabla con los clientes filtrados
            function renderizarTabla(listaClientes) {
                let tablaHTML = `
                    <table class="Tabla tabla-cv Yabla">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                listaClientes.forEach((cliente, index) => {
                    tablaHTML += `
                        <tr class="fila-cliente" data-index="${index}">
                            <td>${index + 1}</td>
                            <td>${cliente.Nombres}</td>
                            <td>${cliente.Apellidos}</td>
                        </tr>
                    `;
                });

                tablaHTML += `</tbody></table>`;

                // Reemplazar contenido de la tabla
                document.getElementById("TablaContainer").innerHTML = tablaHTML;

                // Agregar evento a cada fila para capturar la selección del usuario
                let filas = document.querySelectorAll(".fila-cliente");
                filas.forEach(fila => {
                    fila.addEventListener("click", (event) => {
                        let index = event.currentTarget.getAttribute("data-index");
                        let clienteSeleccionado = listaClientes[index];
                        console.log("Usuario seleccionado:", clienteSeleccionado);
                        ipcRenderer.send("EClienteSeleccionado",clienteSeleccionado)
                    });
                });
            }

            // Renderizar la tabla con todos los clientes inicialmente
            renderizarTabla(clientes);

            // Evento de búsqueda
            document.getElementById("BuscarBtn").addEventListener("click", () => {
                let textoBusqueda = document.getElementById("BuscarInput").value.trim().toLowerCase();
                if (textoBusqueda === "") {
                    renderizarTabla(clientes); // Si el campo está vacío, mostrar todos los clientes
                    return;
                }

                // Crear expresión regular para buscar en nombre y apellido
                let regex = new RegExp(textoBusqueda, "i");

                // Filtrar los clientes que coincidan con la búsqueda
                let clientesFiltrados = clientes.filter(cliente => 
                    regex.test(cliente.Nombres) || regex.test(cliente.Apellidos)
                );

                // Renderizar la tabla con los resultados filtrados
                renderizarTabla(clientesFiltrados);
            });
        }
    });


