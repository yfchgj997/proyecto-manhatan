// Variables
let Codigo;

// Función -> Generar código para la tabla de diarios
function GenerarCodigo(datosFiltrados, fechaSeleccionada, CapitalEconomicoEmpresarial, CapitalMaterialEmpresarial) {

    // mensaje de flujo 
    console.log("TablaDiarios: Generando el código para el componente TablaDiarios");

    // Validar que haya datos después del filtrado
    if (datosFiltrados.length === 0) {
        console.warn("ADVERTENCIA: No hay diarios para la fecha seleccionada.");
        return `
            <div class="TablaDiarios">
                <input type="date" id="fechaFiltro" value="${fechaSeleccionada}">
                <button id="BotonFiltrarDiarios">Filtrar</button>
                <p>No hay datos disponibles para la fecha seleccionada.</p>
            </div>
        `;
    }

    // Ordenar datosFiltrados en orden descendente por fecha (más reciente a más antiguo)
    datosFiltrados.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

    // Generar filas de la tabla con los datos filtrados
    let filas = datosFiltrados.map((dato, index, array) => {

        // Obtener el siguiente elemento cronológico (el más reciente)
        // Si estamos en el más reciente (índice 0), comparamos con el capital actual.
        // Si no, tomamos el capital inicial del día "siguiente" (que en la lista descendente está en index - 1).
        let siguienteCapitalMaterial = (index === 0) ? CapitalMaterialEmpresarial : array[index - 1].CapitalMaterialInicial;
        let siguienteCapitalEconomico = (index === 0) ? CapitalEconomicoEmpresarial : array[index - 1].CapitalEconomicoInicial;

        // Calcular diferencias
        let diferenciaEconomico = parseFloat(siguienteCapitalEconomico) - parseFloat(dato.CapitalEconomicoInicial);
        let diferenciaMaterial = parseFloat(siguienteCapitalMaterial) - parseFloat(dato.CapitalMaterialInicial);

        // Formatear diferencias
        let difEconomicoStr = diferenciaEconomico.toFixed(2) + " S/.";
        let difMaterialStr = diferenciaMaterial.toFixed(2) + " g.";

        return `
            <tr>
                <td>${dato.Fecha}</td>
                <td>${dato.CapitalEconomicoInicial} S/.</td>
                <td>${difEconomicoStr}</td>
                <td>${siguienteCapitalEconomico} S/.</td>
                <td>${dato.CapitalMaterialInicial} g.</td>
                <td>${difMaterialStr}</td>
                <td>${siguienteCapitalMaterial}</td>
                <td><button class="BotonVerAzul" IDMovimiento="${dato.IDMovimiento}" Tipo="${dato.Tipo}" CapitalEconomicoInicial="${dato.CapitalEconomicoInicial}" CapitalMaterialInicial="${dato.CapitalMaterialInicial}">Ver</button></td>
            </tr>
        `;
    }).join("");


    // Generar código HTML de la tabla
    let NuevoCodigo = `
            <style>
                .contenedor-tabla-diarios {
                    max-height: 500px;
                    overflow-y: auto;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                }

            </style>
            <div class="contenedor-tabla-diarios">
                <table class="Tabla tabla-cv">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cap. Eco. Inicial</th>
                            <th>Total Economico</th>
                            <th>Cap. Eco. Final</th>
                            <th>Cap. Mat. Inicial</th>
                            <th>Total Material</th>
                            <th>Cap. Mat. Final</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
    `;

    return NuevoCodigo;
}

// Función -> Cargar la tabla de diarios
function CargarTablaDiarios(datos, fecha, CapitalEconomicoEmpresarial, CapitalMaterialEmpresarial) {

    // mensaje de flujo
    console.log("TablaDiarios: Cargando el componente TablaDiarios");

    // Guardar los datos en una variable global
    DatosGlobales = datos;

    // Obtener el espacio para cargar el componente
    let Espacio = document.getElementById("EspacioDiario");
    if (Espacio) {
        console.log("MENSAJE: Se obtuvo el espacio para cargar TablaDiarios");

        // Generar el código con la fecha seleccionada
        Codigo = GenerarCodigo(datos, fecha, CapitalEconomicoEmpresarial, CapitalMaterialEmpresarial);

        // Insertar el código HTML en el espacio
        Espacio.innerHTML = Codigo;

        // Agregar event listeners a todos los botones "Ver"
        const { ipcRenderer } = require('electron');
        let botonesVer = Espacio.querySelectorAll('button[IDMovimiento]');

        console.log(`TablaDiarios: Agregando event listeners a ${botonesVer.length} botones Ver`);

        botonesVer.forEach(boton => {
            boton.addEventListener('click', (e) => {
                // Obtener la fecha de la fila
                const fila = e.target.closest('tr');
                const fecha = fila.querySelector('td').textContent;

                console.log(`TablaDiarios: Click en botón Ver para fecha: ${fecha}`);

                // Obtener datos iniciales de los atributos del botón
                const capitalEconomicoInicial = e.target.getAttribute('CapitalEconomicoInicial');
                const capitalMaterialInicial = e.target.getAttribute('CapitalMaterialInicial');

                console.log(`TablaDiarios: Click en botón Ver para fecha: ${fecha}, CEIni: ${capitalEconomicoInicial}, CMIni: ${capitalMaterialInicial}`);

                // Enviar evento al main.js para obtener los detalles del día con los saldos iniciales
                ipcRenderer.send('EQuiereVerDetallesDia', {
                    fecha,
                    capitalEconomicoInicial: parseFloat(capitalEconomicoInicial || 0),
                    capitalMaterialInicial: parseFloat(capitalMaterialInicial || 0)
                });
            });
        });

    } else {
        console.error("ERROR: No se encontró el espacio para cargar TablaDiarios");
    }
}

// Exportar función para su uso en otros archivos
module.exports = { CargarTablaDiarios };
