const { ipcRenderer } = require("electron")

// Eventos

// Evento -> inicializar ventana
// Evento -> inicializar ventana
console.log("SelectUserWindow.js loaded"); // Verify load
ipcRenderer.on("EInicializarSelectUserWindow", (event, clientes) => {
    // Mensaje de flujo
    console.log("MENSAJE: inicializando la ventana SelectUserWindow");
    console.log("-> La ventana se iniciará con los siguientes clientes");
    console.log(clientes);

    // Obtener el espacio donde se colocará la tabla
    let EspacioTabla = document.getElementById("TablaClientes");

    if (EspacioTabla) {
        // Renderizar Estructura Base (Header + Buscador + Tabla Container + Notification Area)
        let estructuraHTML = `
            <div class="header">
                <img src="../imagenes/LogoRedSur.png" alt="Logo" class="header-logo"> 
                <div class="header-title">Seleccionar Cliente</div>
            </div>

            <div class="search-container">
                <div class="search-input-wrapper">
                    <input type="text" id="BuscarInput" placeholder="Ingresa el nombre o los apellidos ...">
                    <span class="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                </div>
            </div>

            <div id="TablaContainer"></div>

            <div id="NotificationArea"></div>
        `;

        EspacioTabla.innerHTML = estructuraHTML;


        // Función para renderizar la tabla con los clientes filtrados
        function renderizarTabla(listaClientes) {
            let tablaHTML = `
                    <table class="Tabla">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Opciones</th> 
                            </tr>
                        </thead>
                        <tbody>
                `;

            if (listaClientes.length === 0) {
                tablaHTML += `
                     <tr>
                        <td colspan="4" class="empty-state">
                            <div class="empty-state-icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-frown"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                            </div>
                            <div><strong>Error!</strong><br>No se pudo obtener la lista de clientes</div>
                        </td>
                    </tr>
                 `;
            } else {
                listaClientes.forEach((cliente, index) => {
                    // Formato 01, 02, etc.
                    let numero = (index + 1).toString().padStart(2, '0');

                    tablaHTML += `
                            <tr class="fila-cliente">
                                <td>${numero}</td>
                                <td>${cliente.Nombres}</td>
                                <td>${cliente.Apellidos || '-'}</td>
                                <td>
                                    <button class="btn-elegir" data-index="${index}">Elegir</button>
                                </td>
                            </tr>
                        `;
                });
            }

            tablaHTML += `</tbody></table>`;

            // Reemplazar contenido de la tabla
            document.getElementById("TablaContainer").innerHTML = tablaHTML;

            // Agregar evento a los botones "Elegir"
            let botonesElegir = document.querySelectorAll(".btn-elegir");
            botonesElegir.forEach(boton => {
                boton.addEventListener("click", (event) => {
                    let index = event.currentTarget.getAttribute("data-index");
                    let clienteSeleccionado = listaClientes[index];

                    if (clienteSeleccionado) {
                        console.log("Cliente seleccionado:", clienteSeleccionado);
                        // Mostrar notificación de éxito
                        mostrarNotificacion("Se selecciona al cliente de manera correcta", "success");

                        // Enviar al proceso principal con un pequeño delay para que se vea la notificación
                        setTimeout(() => {
                            ipcRenderer.send("EClienteSeleccionado", clienteSeleccionado);
                        }, 1000); // 1 segundo de espera
                    } else {
                        mostrarNotificacion("No se pudo seleccionar al cliente", "error");
                    }
                });
            });
        }

        // Función para mostrar notificaciones
        function mostrarNotificacion(mensaje, tipo) {
            let area = document.getElementById("NotificationArea");
            let iconSvg = tipo === 'success'
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

            area.style.display = "flex";
            area.innerHTML = `
                <div class="notification ${tipo}">
                    ${iconSvg}
                    <span>${mensaje}</span>
                </div>
            `;

            // Ocultar después de unos segundos si es error (success cerrará la ventana)
            if (tipo === 'error') {
                setTimeout(() => {
                    area.style.display = "none";
                }, 3000);
            }
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
