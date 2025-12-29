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

    // Generar filas de la tabla con los datos filtrados
    let filas = datosFiltrados.map((dato, index, array) => {

        // Obtener el siguiente elemento si existe, de lo contrario, usar 0
        let siguienteCapitalMaterial = array[index + 1] ? array[index + 1].CapitalMaterialInicial : CapitalMaterialEmpresarial;
        let siguienteCapitalEconomico = array[index + 1] ? array[index + 1].CapitalEconomicoInicial : CapitalEconomicoEmpresarial;

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
                <td style="font-weight: bold; color: ${diferenciaEconomico >= 0 ? 'green' : 'red'};">${difEconomicoStr}</td>
                <td>${siguienteCapitalEconomico} S/.</td>
                <td>${dato.CapitalMaterialInicial} g.</td>
                <td style="font-weight: bold; color: ${diferenciaMaterial >= 0 ? 'green' : 'red'};">${difMaterialStr}</td>
                <td>${siguienteCapitalMaterial}</td>
                <td><button class="BotonVerAzul" IDMovimiento="${dato.IDMovimiento}" Tipo="${dato.Tipo}">Ver</button></td>
            </tr>
        `;
    }).join("");


    // Generar código HTML de la tabla
    let NuevoCodigo = `
            <table class="Tabla tabla-cv">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cap. Eco. Inicial</th>
                        <th>Diferencia</th>
                        <th>Cap. Eco. Final</th>
                        <th>Cap. Mat. Inicial</th>
                        <th>Diferencia</th>
                        <th>Cap. Mat. Final</th>
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

                // Enviar evento al main.js para obtener los detalles del día
                ipcRenderer.send('EQuiereVerDetallesDia', { fecha });
            });
        });

    } else {
        console.error("ERROR: No se encontró el espacio para cargar TablaDiarios");
    }
}

// Exportar función para su uso en otros archivos
module.exports = { CargarTablaDiarios };
