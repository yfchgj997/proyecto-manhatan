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
            document.getElementById("BotonDescargarTabla").addEventListener("click",()=>{
                ipcRenderer.send("EDescargarTablaMovimientos", datos.Movimientos);
            })
            document.getElementById("BotonVolverDeEstadoDeCuenta").addEventListener("click",()=>{
                ipcRenderer.send("EQuiereGestionarClientes");
            });
            console.log("Eventos de botones asignados correctamente.");
        }, 100);

}

module.exports = { CargarEstadoDeCuentaCliente };
