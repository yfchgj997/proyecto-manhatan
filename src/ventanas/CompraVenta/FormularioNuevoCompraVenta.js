const { ipcRenderer } = require("electron");

// Variables

    // codigo
    let codigo = ``

// Funciones

    function ModificarCodigo(fecha) {
        // Mensaje de flujo
        console.log("Se ingresó a la función ModificarCodigo");
        console.log("Fecha:", fecha);
        let codigo = `
            <div class="Formulario">
                <h2 class="EncabezadoFormulario">Nuevo Movimiento</h2>
                <div class="Campos">
                    <div class="Campo">
                        <p>Fecha:</p>
                        <input id="CampoFechaMovimiento" name="fecha" type="date" value="${fecha}">
                    </div>
                    <div class="Campo">
                        <p>Cliente:</p>
                        <input id="CampoCliente" name="cliente" type="text">
                    </div>
                    <div class="Campo">
                        <p>Tipo:</p>
                        <select id="CampoTipoMovimiento" name="tipo">
                            <option value="venta" selected>Venta</option>
                            <option value="compra">Compra</option>
                        </select>
                    </div>
                    <div class="Campo">
                        <p>Monto Material:</p>
                        <input id="CampoMontoMaterial" name="montoMaterial" type="number" step="0.01">
                    </div>
                    <div class="Campo">
                        <p>Monto Económico:</p>
                        <input id="CampoMontoEconomico" name="montoEconomico" type="number" step="0.01">
                    </div>
                    <div class="Campo">
                        <p>Precio de Cambio:</p>
                        <input id="CampoPrecioCambio" name="precioCambio" type="number" step="0.01">
                    </div>
                </div>
                <button class="Boton BotonFormulario" id="BotonGuardarNuevoCompraVenta">Guardar</button>
            </div>
        `;

        return codigo; // Devuelve el HTML generado
    }

    function GuardarCompraVenta (usuarioAutenticado){
        // Mensaje de flujo
        console.log("MENSAJE: Guardando un nuevo compra venta");
        
        // Capturar los datos
        let NuevoCompraVenta = {
            "Tipo": document.getElementById("CampoTipoMovimiento").value,
            "Fecha": document.getElementById("CampoFechaMovimiento").value,
            "EmpleadoNombre": usuarioAutenticado.Nombres, // Ahora se obtiene directamente del input
            "EmpleadoID": usuarioAutenticado.ID, // Ahora se obtiene directamente del input
            "Cliente": document.getElementById("CampoCliente").value,
            "MontoMaterial": parseFloat(document.getElementById("CampoMontoMaterial").value) || 0,
            "MontoEconomico": parseFloat(document.getElementById("CampoMontoEconomico").value) || 0,
            "PrecioCambio": parseFloat(document.getElementById("CampoPrecioCambio").value) || 0,
        };
        
        // Mensaje de flujo
        console.log("MENSAJE: Estos son los datos de compra venta:");
        console.log(NuevoCompraVenta);
        
        // Enviar los datos del movimiento al proceso principal
        ipcRenderer.send("EQuiereGuardarNuevoCompraVenta", NuevoCompraVenta);
    }
    
    // Funcion -> cargar componente
    function CargarFormularioNuevoCompraVenta(usuarioAutenticado,fecha) {

        console.log("MENSAJE: cargando el componente formulario nuevo compra venta");
    
        let EspacioFormularioNuevoCompraVenta = document.getElementById("EspacioFormularioNuevoCompraVenta");
    
        if (EspacioFormularioNuevoCompraVenta) {
            // Paso -> actualizar el HTML generado
            codigo = ModificarCodigo(fecha);
            EspacioFormularioNuevoCompraVenta.innerHTML = codigo;

            // Asegurarse de que el botón existe antes de agregar el evento
            let botonGuardar = document.getElementById("BotonGuardarNuevoCompraVenta");
            if (botonGuardar) {
                botonGuardar.addEventListener("click",()=>{GuardarCompraVenta(usuarioAutenticado)});
            } else {
                console.log("ERROR: No se encontró el botón 'BotonGuardarNuevoMovimiento'");
            }
        } else {
            console.log("ERROR: No se pudo obtener el espacio para colocar formulario nuevo movimiento");
        }
    }

    ipcRenderer.on("EActualizarSoloCliente", (event, cliente) => {

        console.log("--------------")
        console.log(cliente)
        console.log("--------------")

        let boton = document.getElementById("BotonSelectCliente");
        if (boton) {
            boton.textContent = cliente.Nombres; // Actualiza el texto del botón con el nombre del cliente
            boton.setAttribute("nombres", cliente.Nombres); // Agrega un atributo personalizado 'nombres'
            boton.setAttribute("IDExterno", cliente.ID)
        } else {
            console.error("No se encontró el botón con ID 'BotonSelectCliente'");
        }
    });    

module.exports = { CargarFormularioNuevoCompraVenta };