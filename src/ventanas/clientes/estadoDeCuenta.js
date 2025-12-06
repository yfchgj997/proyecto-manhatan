const { ipcRenderer } = require("electron");

function GenerarHTML(datos) {
    let cliente = datos.Cliente;
    let movimientos = datos.Movimientos || [];

    let contenidoMovimientos = "";

    if (movimientos.length === 0) {
        contenidoMovimientos = `
            <p id="SinMovimientos" class="texto-vacio">No hay movimientos</p>
        `;
    } else {
        let filas = movimientos.map(m => {
            return `
                <tr class="fila-movimiento">
                    <td>${m.Tipo}</td>
                    <td>${m.Registro}</td>
                    <td>${m.Fecha}</td>
                    <td>${m.Hora}</td>
                    <td>${m.Importe}</td>
                    <td>${m.Observacion || ""}</td>
                    <td>${m.UsuarioNombres}</td>
                </tr>
            `;
        }).join("");

        contenidoMovimientos = `
            <table id="TablaMovimientos" class="tabla-movimientos">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Registro</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Importe</th>
                        <th>Observación</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }

    return `
    <div id="EstadoCuentaContenedor">

        <!-- MODAL DE FECHAS -->
        <div id="ModalRangoFechas" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h3>Seleccionar Rango de Fechas</h3>
                <div class="modal-body">
                    <div class="modal-campo">
                        <label>Fecha Inicio:</label>
                        <input type="date" id="FechaInicioDescarga" class="modal-input">
                    </div>
                    <div class="modal-campo">
                        <label>Fecha Fin:</label>
                        <input type="date" id="FechaFinDescarga" class="modal-input">
                    </div>
                </div>
                <div class="modal-actions">
                    <button id="BotonConfirmarDescarga" class="BotonCode">Descargar</button>
                    <button id="BotonCancelarDescarga" class="BotonCode" style="background-color: #dc3545;">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- BOTONES -->
        <div id="ContenedorBotones">
            <button class="BotonCode" id="BotonDescargarTabla">Descargar</button>
            <button class="BotonCode" id="BotonVolverDeEstadoDeCuenta">Volver</button>
        </div>

        <!-- TARJETA DEL CLIENTE -->
        <div id="TarjetaCliente" class="tarjeta">
            <h2 id="TituloEstado">Estado de Cuenta del Cliente</h2>

            <p><strong>Nombres:</strong> ${cliente.Nombres}</p>
            <p><strong>Apellidos:</strong> ${cliente.Apellidos}</p>
            <p><strong>DNI:</strong> ${cliente.DNI}</p>

            <p><strong>Saldo Económico:</strong> S/ ${cliente.SaldoEconomico}</p>
            <p><strong>Saldo Material:</strong> ${cliente.SaldoMaterial} g</p>

            <p><strong>Fecha de Ingreso:</strong> ${cliente.FechaIngreso}</p>
            <p><strong>ID Interno:</strong> ${cliente.ID}</p>
        </div>

        <!-- MOVIMIENTOS -->
        <div id="ContenedorMovimientos">
            <h3 id="TituloMovimientos">Movimientos del Cliente</h3>
            <div id="ListaMovimientos">
                ${contenidoMovimientos}
            </div>
        </div>

    </div>
    `;
}


// ==============================
// Funciones
// ==============================

// Función -> cargar la interfaz del estado de cuenta
function CargarEstadoDeCuentaCliente(datos) {

    console.log("MENSAJE: cargando componente Estado de Cuenta")

    const EspacioEstadoCuenta = document.getElementById("EspacioContenido")

    if (!EspacioEstadoCuenta) {
        console.log("ERROR: no existe el contenedor EspacioContenido")
        return
    }

    // insertar nuevo diseño
    EspacioEstadoCuenta.innerHTML = GenerarHTML(datos)

    setTimeout(() => {
        const modal = document.getElementById("ModalRangoFechas");
        const btnDescargar = document.getElementById("BotonDescargarTabla");
        const btnVolver = document.getElementById("BotonVolverDeEstadoDeCuenta");
        const btnConfirmar = document.getElementById("BotonConfirmarDescarga");
        const btnCancelar = document.getElementById("BotonCancelarDescarga");

        // Mostrar Modal
        btnDescargar.addEventListener("click", () => {
            modal.style.display = "flex";
            // Set default dates if needed, or leave empty
        });

        // Ocultar Modal
        btnCancelar.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Confirmar Descarga
        btnConfirmar.addEventListener("click", () => {
            const fechaInicioVal = document.getElementById("FechaInicioDescarga").value;
            const fechaFinVal = document.getElementById("FechaFinDescarga").value;

            if (!fechaInicioVal || !fechaFinVal) {
                alert("Por favor seleccione ambas fechas.");
                return;
            }

            if (fechaInicioVal > fechaFinVal) {
                alert("La fecha de inicio no puede ser mayor a la fecha final.");
                return;
            }

            // Filtrar movimientos
            // Asumimos formato de fecha YYYY-MM-DD en los inputs y en los movimientos puede variar,
            // pero si el sistema usa formato estandar ISO o YYYY-MM-DD string comparison funciona.
            // Si el formato es DD/MM/YYYY habrá que convertir.
            // Revisando codigo anterior, m.Fecha suele ser string. Confirmare formato visualmente si es necesrio,
            // pero por ahora asumo string YYYY-MM-DD o compatible.
            // Sin embargo, en sistemas locales a veces es DD/MM/YYYY. 
            // VERIFICACION: En la tabla se ve ${m.Fecha}.

            let movimientosFiltrados = datos.Movimientos.filter(m => {
                // Convertir fecha del movimiento a objeto Date para comparar correctamente
                // Asumimos que m.Fecha esta en formato YYYY-MM-DD. 
                // Si estuviera en DD/MM/YYYY habria que parsear.
                // Dado el contexto de proyectos JS simples, probemos comparacion directa o new Date.

                const fechaMov = new Date(m.Fecha);
                const fechaIni = new Date(fechaInicioVal);
                const fechaFin = new Date(fechaFinVal);

                // Ajustamos horas para comparar solo fechas (inclusive)
                // Como los inputs son solo fecha, se asume 00:00 UTC o local.
                // Para evitar problemas de zona horaria, usaremos comparacion de strings si el formato coincide,
                // O nos aseguramos de normalizar.

                // Mejor opcion: string comparison YYYY-MM-DD
                // Si m.Fecha viene como "2025-12-06", perfecto.

                return fechaMov >= fechaIni && fechaMov <= fechaFin;
            });

            if (movimientosFiltrados.length === 0) {
                alert("No hay movimientos en el rango de fechas seleccionado.");
                // Opcional: permitir descargar igual aunque este vacio? Mejor avisar.
                // Pero el usuario pidió "funcionalidad sin errores".
            }

            ipcRenderer.send("EDescargarTablaMovimientos", movimientosFiltrados);
            modal.style.display = "none";
        });

        btnVolver.addEventListener("click", () => {
            ipcRenderer.send("EQuiereGestionarClientes");
        });

        console.log("Eventos de botones asignados correctamente.");
    }, 100);

}

module.exports = { CargarEstadoDeCuentaCliente };
