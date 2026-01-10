// Variables
let Codigo;

// Función -> Generar código para la tabla de diarios
function GenerarCodigo(datosFiltrados, fechaSeleccionada, CapitalEconomicoEmpresarial, CapitalMaterialEmpresarial) {

    // mensaje de flujo 
    console.log("TablaDiarios: Generando el código para el componente TablaDiarios");
    console.log("eeeeeeeeeeee3eeeeeeeeeeeeeeee")
    console.log("Capital Economico: " + CapitalEconomicoEmpresarial)
    console.log("Capital Material: " + CapitalMaterialEmpresarial)

    // Ordenar por fecha (De mas reciente a mas antiguo)
    datosFiltrados.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

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

    // Generar filas de la tabla con los datos filtrados
    let filas = datosFiltrados.map((dato, index, array) => {

        // Obtener el siguiente elemento (el más reciente, index - 1) para obtener el capital final del día actual
        // Si es el primer elemento (el más reciente), el final es el actual global
        let siguienteCapitalMaterial = index === 0 ? CapitalMaterialEmpresarial : array[index - 1].CapitalMaterialInicial;
        let siguienteCapitalEconomico = index === 0 ? CapitalEconomicoEmpresarial : array[index - 1].CapitalEconomicoInicial;

        // Calcular totales (diferencia entre final e inicial)
        let totalEconomico = (siguienteCapitalEconomico - dato.CapitalEconomicoInicial).toFixed(2);
        let totalMaterial = (siguienteCapitalMaterial - dato.CapitalMaterialInicial).toFixed(2);

        console.log("========== FILA " + index + " ==========")
        console.log("Es última fila: " + (index === array.length - 1))
        console.log("CapitalEconomicoEmpresarial (parámetro): " + CapitalEconomicoEmpresarial)
        console.log("CapitalMaterialEmpresarial (parámetro): " + CapitalMaterialEmpresarial)
        console.log("siguienteCapitalEconomico (calculado): " + siguienteCapitalEconomico)
        console.log("siguienteCapitalMaterial (calculado): " + siguienteCapitalMaterial)
        console.log("dato.CapitalEconomicoInicial: " + dato.CapitalEconomicoInicial)
        console.log("dato.CapitalMaterialInicial: " + dato.CapitalMaterialInicial)
        console.log("totalEconomico: " + totalEconomico)
        console.log("totalMaterial: " + totalMaterial)

        return `
            <tr>
                <td>${dato.Fecha}</td>
                <td>${dato.CapitalEconomicoInicial} S/.</td>
                <td>${totalEconomico} S/.</td>
                <td>${siguienteCapitalEconomico} S/.</td>
                <td>${dato.CapitalMaterialInicial} g.</td>
                <td>${totalMaterial} g.</td>
                <td>${siguienteCapitalMaterial}</td>
                <td><button class="BotonVerAzul" IDMovimiento="${dato.IDMovimiento}" Tipo="${dato.Tipo}" CapitalEconomicoInicial="${dato.CapitalEconomicoInicial}" CapitalMaterialInicial="${dato.CapitalMaterialInicial}">Ver</button></td>
            </tr>
        `;
    }).join("");


    // Generar código HTML de la tabla
    let NuevoCodigo = `

            <table class="Tabla tabla-cv">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Capital Económico Inicial</th>
                        <th>Total Económico</th>
                        <th>Capital Económico Final</th>
                        <th>Capital Material Inicial</th>
                        <th>Total Material</th>
                        <th>Capital Material Final</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
    `;

    return NuevoCodigo;
}

// Función -> Cargar la tabla de diarios
function CargarTablaDiarios(datos, fecha, CapitalEconomicoEmpresarial, CapitalMaterialEmpresarial) {

    // mensaje de flujo
    console.log("TablaDiarios: Cargando el componente TablaDiarios");
    console.log("ddddddddddddddddddddddddddddddddddd")
    console.log("Capital Economico: " + CapitalEconomicoEmpresarial)
    console.log("Capital Material: " + CapitalMaterialEmpresarial)

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

// Evento -> actualizar tabla diaria
ipcRenderer.on("EActualizarTablaDiaria", (event, datos) => {
    console.log(" ----------MENSAJE: actualizando tabla diaria")
    console.log("Capital Economico: " + datos.CapitalEconomico)
    console.log("Capital Material: " + datos.CapitalMaterial)
    // Paso -> cargar tabla diarios
    CargarTablaDiarios(datos.diarios, datos.fecha, datos.CapitalEconomico, datos.CapitalMaterial)
})

// Exportar función para su uso en otros archivos
module.exports = { CargarTablaDiarios };
