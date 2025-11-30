// Variables

// Funciones

// Función -> cargar la tabla con todos los clientes
function CargarTablaUsuarios(usuarios) {
    // Mensaje de flujo
    console.log("MENSAJE: Cargando el componente tabla usuarios");
    console.log("MENSAJE: Llegaron estos usuarios:");
    console.log(usuarios);

    let codigo = ""; // Se define dentro de la función para evitar problemas de sobrescritura

    if (usuarios && usuarios.length > 0) {
        console.log("MENSAJE: Se encontraron usuarios, generando tabla...");

        // Construcción del código HTML para la tabla
        codigo = `
            <table class="Tabla tabla-usuarios">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Nombres y Apellidos</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        usuarios.forEach((usuario, index) => {
            let numeroFila = String(index + 1).padStart(2, '0');
            let datosUsuario = JSON.stringify(usuario); // Se pasa el objeto cliente directamente

            // mensaje de flujo
            console.log("Este es el usuario que se pondra en la tabla: ")
            console.log(datosUsuario)

            codigo += `
                <tr data-info='${datosUsuario}'>
                    <td>${numeroFila}</td>
                    <td class="nombre-usuario">${usuario.Nombres} ${usuario.Apellidos}</td>
                    <td class="cargo-usuario">${usuario.Rol}</td>
                    <td class="saldo-usuario">${usuario.Estado}</td>
                    <td class="opciones">
                        <button class="BotonOpcion OpcionEditar">✎</button>
                        <button class="BotonOpcion OpcionEliminar">✖</button>
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
        console.log("ERROR: No hay usuarios para mostrar");

        // Se muestra un mensaje de "no hay clientes"
        codigo = `
            <div>
                <p>No hay usuarios</p>
            </div>
        `;
    }

    // Se obtiene el espacio donde se insertará la tabla
    let EspacioTablaUsuarios = document.getElementById("EspacioTablaUsuarios");

    if (EspacioTablaUsuarios) {
        // Se inserta el código HTML en el DOM
        EspacioTablaUsuarios.innerHTML = codigo;

        // Se usa setTimeout para asegurar que el DOM se actualice antes de agregar eventos
        setTimeout(() => {
            document.querySelectorAll(".OpcionEditar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosUsuario = fila.getAttribute("data-info");

                    try {
                        let usuarioObjeto = JSON.parse(datosUsuario);

                        if (typeof ipcRenderer !== "undefined") {
                            // mensaje de flujo
                            console.log("MENSAJE: enviando un evento de mostrar formulario con el siguiente usuario:")
                            console.log(usuarioObjeto)
                            ipcRenderer.send("EQuiereFormularioEditarUsuario", usuarioObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del usuario a objeto:", error);
                    }
                });
            });

            document.querySelectorAll(".OpcionEliminar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let fila = this.closest("tr");
                    let datosUsuario = fila.getAttribute("data-info");

                    try {
                        let usuarioObjeto = JSON.parse(datosUsuario);

                        if (typeof ipcRenderer !== "undefined") {
                            ipcRenderer.send("EEliminarUsuario", usuarioObjeto);
                        } else {
                            console.error("ERROR: ipcRenderer no está disponible.");
                        }
                    } catch (error) {
                        console.error("Error al convertir datos del usuario a objeto:", error);
                    }
                });
            });

            console.log("Eventos de botones asignados correctamente.");
        }, 100);
    } else {
        console.log("ERROR: No se pudo obtener el espacio de la tabla usuarios");
    }
}

module.exports = {
    CargarTablaUsuarios
};
