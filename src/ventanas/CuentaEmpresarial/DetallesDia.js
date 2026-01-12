const { ipcRenderer } = require("electron");

// Variables
let DatosActuales = null;

// ==========================================
// LÓGICA DE PROCESAMIENTO DE DATOS
// ==========================================

function ProcesarMovimientos(datos) {
    const movimientos = datos.movimientos || []; // Clientes, Ventas
    const movEmpresariales = datos.movimientosEmpresariales || []; // Empresariales

    let listaUnificada = [];

    // 1. Unificar Movimientos de Clientes y Ventas
    movimientos.forEach(m => {
        let item = {
            Fecha: m.Fecha,
            Hora: m.Hora || "00:00:00",
            TipoOriginal: m.Tipo, // Ingreso, Retiro, Compra, Venta
            Registro: m.Registro, // Economico, Material, VentaOcasional
            Cliente: m.ClienteN || m.ClienteNombres || m.Cliente || "Desconocido",
            Observacion: m.Observacion || "",

            // Valores Económicos
            EcoIngreso: 0,
            EcoEgreso: 0,

            // Valores Materiales
            MatIngreso: 0,
            MatEgreso: 0,

            EsVenta: false,
            EsEmpresarial: false
        };

        // NORMALIZACIÓN DE VALORES

        let importeOperacion = 0;
        let pesoOperacion = 0;

        if (m.Registro === "Economico") {
            importeOperacion = parseFloat(m.Importe || 0);
            if (m.Tipo === "Ingreso") item.EcoIngreso = importeOperacion;
            else if (m.Tipo === "Retiro") item.EcoEgreso = importeOperacion;
        }
        else if (m.Registro === "Material") {
            // EN MATERIAL: La propiedad 'Importe' guarda el PESO
            pesoOperacion = parseFloat(m.Importe || 0);

            if (m.Tipo === "Ingreso") item.MatIngreso = pesoOperacion;
            else if (m.Tipo === "Retiro") item.MatEgreso = pesoOperacion;
        }
        else if (m.Registro === "VentaOcasional") {
            item.EsVenta = true;
            // VENTAS/COMPRAS: Usan MontoEconomico y MontoMaterial
            importeOperacion = parseFloat(m.MontoEconomico || m.Importe || 0);
            pesoOperacion = parseFloat(m.MontoMaterial || m.Peso || 0);

            // Compra: Entra material, sale dinero
            if (m.Tipo === "compra" || m.Tipo === "Compra") {
                item.MatIngreso = pesoOperacion;
                item.EcoEgreso = importeOperacion;
            }
            // Venta: Entra dinero, sale material
            else if (m.Tipo === "venta" || m.Tipo === "Venta") {
                item.EcoIngreso = importeOperacion;
                item.MatEgreso = pesoOperacion;
            }
        }

        listaUnificada.push(item);
    });

    // 2. Unificar Movimientos Empresariales
    movEmpresariales.forEach(m => {
        let item = {
            Fecha: m.Fecha,
            Hora: m.Hora || "00:00:00",
            TipoOriginal: m.Operacion, // Aumentar, Disminuir
            Registro: "Empresarial",
            Cliente: "EMPRESA", // O el usuario
            Observacion: m.Detalle || "",

            EcoIngreso: 0,
            EcoEgreso: 0,
            MatIngreso: 0,
            MatEgreso: 0,

            EsVenta: false,
            EsEmpresarial: true,
            TipoEmpresarial: m.Tipo // Capital, Material
        };

        const importe = parseFloat(m.Importe || 0);

        if (m.Tipo === "Capital") {
            if (m.Operacion === "Aumentar") item.EcoIngreso = importe;
            else if (m.Operacion === "Disminuir") item.EcoEgreso = importe;
        }
        else if (m.Tipo === "Material") {
            if (m.Operacion === "Aumentar") item.MatIngreso = importe;
            else if (m.Operacion === "Disminuir") item.MatEgreso = importe;
        }

        listaUnificada.push(item);
    });

    // 3. Ordenar por Hora
    listaUnificada.sort((a, b) => {
        if (a.Hora < b.Hora) return -1;
        if (a.Hora > b.Hora) return 1;
        return 0;
    });

    // 4. Calcular Saldos Acumulados
    // Iniciamos con los saldos que vienen de main (que son los iniciales del día)
    let saldoEco = parseFloat(datos.capitalEconomicoInicial || 0);
    let saldoMat = parseFloat(datos.capitalMaterialInicial || 0);

    listaUnificada.forEach(item => {
        // Actualizar saldo paso a paso
        saldoEco = saldoEco + item.EcoIngreso - item.EcoEgreso;
        saldoMat = saldoMat + item.MatIngreso - item.MatEgreso;

        // Asignar el saldo resultante A ESTA FILA
        item.SaldoEco = saldoEco;
        item.SaldoMat = saldoMat;
    });

    return listaUnificada;
}

// ==========================================
// GENERACIÓN DE HTML
// ==========================================

function GenerarLeyenda() {
    return `
        <div class="ContenedorLeyenda">
            <div class="ItemLeyenda">
                <span class="CuadroColor color-empresa-eco"></span> Movimiento Empresarial Económico (S/)
            </div>
            <div class="ItemLeyenda">
                <span class="CuadroColor color-empresa-mat"></span> Movimiento Empresarial Material (g)
            </div>
            <div class="ItemLeyenda">
                <span class="CuadroColor color-cliente-eco"></span> Movimiento Económico (S/)
            </div>
            <div class="ItemLeyenda">
                <span class="CuadroColor color-cliente-mat"></span> Movimiento Material (g)
            </div>
            <div class="ItemLeyenda">
                <span class="CuadroColor color-venta"></span> Compra / Venta de oro
            </div>
        </div>
    `;
}


function GenerarTablaUnificada(lista, saldoEcoInicial, saldoMatInicial) {
    if (lista.length === 0) {
        return '<p class="MensajeVacio">No hay movimientos registrados para esta fecha.</p>';
    }

    // SEPARAR MOVIMIENTOS EN DOS LISTAS INDEPENDIENTES
    let movimientosEconomicos = [];
    let movimientosMateriales = [];

    lista.forEach((item) => {
        const tieneMovEconomico = item.EcoIngreso !== 0 || item.EcoEgreso !== 0;
        const tieneMovMaterial = item.MatIngreso !== 0 || item.MatEgreso !== 0;

        if (tieneMovEconomico || item.EsVenta) {
            movimientosEconomicos.push({
                ...item,
                esEconomico: true
            });
        }

        if (tieneMovMaterial || item.EsVenta) {
            movimientosMateriales.push({
                ...item,
                esMaterial: true
            });
        }
    });

    // Determinar número máximo de filas
    const maxFilas = Math.max(movimientosEconomicos.length, movimientosMateriales.length);

    let htmlFilas = "";

    // GENERAR FILAS INDEPENDIENTES
    for (let i = 0; i < maxFilas; i++) {
        const movEco = movimientosEconomicos[i];
        const movMat = movimientosMateriales[i];

        let htmlEco = "";
        let htmlMat = "";

        // --- LADO ECONÓMICO ---
        if (movEco) {
            const num = String(i + 1).padStart(2, '0');
            const horaStr = movEco.Hora.substring(0, 5);
            const clienteStr = movEco.Cliente;
            const totalEcoStr = `S/. ${Number(movEco.SaldoEco).toFixed(2)}`;

            // Determinar tipo de descripción
            let tipoDescripcion = "-";
            if (movEco.EsEmpresarial) {
                if (movEco.TipoEmpresarial === "Capital") tipoDescripcion = "Mov. Empresarial Económico";
            }
            else if (movEco.EsVenta) {
                if (movEco.TipoOriginal.toLowerCase() === "venta") tipoDescripcion = "Venta de Oro";
                else if (movEco.TipoOriginal.toLowerCase() === "compra") tipoDescripcion = "Compra de Oro";
                else tipoDescripcion = "Venta Ocasional";
            }
            else {
                if (movEco.Registro === "Economico") tipoDescripcion = "Movimiento Económico";
            }

            // Determinar clase de color
            let claseLadoEco = "";
            if (movEco.EsEmpresarial && movEco.TipoEmpresarial === "Capital") {
                claseLadoEco = "celda-empresa-eco";
            }
            else if (movEco.EsVenta) {
                claseLadoEco = "celda-venta";
            }
            else if (movEco.Registro === "Economico") {
                claseLadoEco = "celda-cliente-eco";
            }

            // Monto
            let montoEcoStr = movEco.EcoIngreso > 0 ? `+ S/. ${movEco.EcoIngreso.toFixed(2)}` : `- S/. ${movEco.EcoEgreso.toFixed(2)}`;
            let classMonto = movEco.EcoIngreso > 0 ? 'texto-verde' : 'texto-rojo';

            htmlEco = `
                <td class="${claseLadoEco} celda-centrada col-num">${num}</td>
                <td class="${claseLadoEco} celda-centrada">${horaStr}</td>
                <td class="${claseLadoEco} celda-centrada col-tipo" style="font-size: 11px;">${tipoDescripcion.toUpperCase()}</td>
                <td class="${claseLadoEco} celda-izquierda" title="${movEco.Observacion}">${clienteStr}</td>
                <td class="${claseLadoEco} celda-derecha ${classMonto}">${montoEcoStr}</td>
                <td class="${claseLadoEco} celda-derecha texto-negrita">${totalEcoStr}</td>
            `;
        } else {
            // Celda vacía - MOSTRAR TOTAL CAPITAL
            // Calcular el último saldo económico conocido hasta esta fila
            let ultimoSaldoEco = saldoEcoInicial;
            for (let j = 0; j < i; j++) {
                if (j < movimientosEconomicos.length) {
                    ultimoSaldoEco = movimientosEconomicos[j].SaldoEco;
                }
            }
            const totalEcoStr = `S/. ${Number(ultimoSaldoEco).toFixed(2)}`;

            htmlEco = `
                <td class="celda-sin-movimiento celda-centrada col-num"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-derecha texto-negrita">${totalEcoStr}</td>
            `;
        }

        // --- LADO MATERIAL ---
        if (movMat) {
            const num = String(i + 1).padStart(2, '0');
            const horaStr = movMat.Hora.substring(0, 5);
            const clienteStr = movMat.Cliente;
            const totalMatStr = `${Number(movMat.SaldoMat).toFixed(0)} g`;

            // Determinar tipo de descripción
            let tipoDescripcion = "-";
            if (movMat.EsEmpresarial) {
                if (movMat.TipoEmpresarial === "Material") tipoDescripcion = "Mov. Empresarial Material";
            }
            else if (movMat.EsVenta) {
                if (movMat.TipoOriginal.toLowerCase() === "venta") tipoDescripcion = "Venta de Oro";
                else if (movMat.TipoOriginal.toLowerCase() === "compra") tipoDescripcion = "Compra de Oro";
                else tipoDescripcion = "Venta Ocasional";
            }
            else {
                if (movMat.Registro === "Material") tipoDescripcion = "Movimiento Material";
            }

            // Determinar clase de color
            let claseLadoMat = "";
            if (movMat.EsEmpresarial && movMat.TipoEmpresarial === "Material") {
                claseLadoMat = "celda-empresa-mat";
            }
            else if (movMat.EsVenta) {
                claseLadoMat = "celda-venta";
            }
            else if (movMat.Registro === "Material") {
                claseLadoMat = "celda-cliente-mat";
            }

            // Monto
            let montoMatStr = movMat.MatIngreso > 0 ? `+ ${movMat.MatIngreso} g` : `- ${movMat.MatEgreso} g`;
            let classMonto = movMat.MatIngreso > 0 ? 'texto-verde' : 'texto-rojo';

            htmlMat = `
                <td class="${claseLadoMat} celda-centrada col-num">${num}</td>
                <td class="${claseLadoMat} celda-centrada">${horaStr}</td>
                <td class="${claseLadoMat} celda-centrada col-tipo" style="font-size: 11px;">${tipoDescripcion.toUpperCase()}</td>
                <td class="${claseLadoMat} celda-izquierda">${clienteStr}</td>
                <td class="${claseLadoMat} celda-derecha ${classMonto}">${montoMatStr}</td>
                <td class="${claseLadoMat} celda-derecha texto-negrita">${totalMatStr}</td>
            `;
        } else {
            // Celda vacía - MOSTRAR TOTAL CAPITAL
            // Calcular el último saldo material conocido hasta esta fila
            let ultimoSaldoMat = saldoMatInicial;
            for (let j = 0; j < i; j++) {
                if (j < movimientosMateriales.length) {
                    ultimoSaldoMat = movimientosMateriales[j].SaldoMat;
                }
            }
            const totalMatStr = `${Number(ultimoSaldoMat).toFixed(0)} g`;

            htmlMat = `
                <td class="celda-sin-movimiento celda-centrada col-num"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-centrada"></td>
                <td class="celda-sin-movimiento celda-derecha texto-negrita">${totalMatStr}</td>
            `;
        }

        htmlFilas += `
            <tr class="fila-dato">
                ${htmlEco}
                ${htmlMat}
            </tr>
        `;
    }

    // CALCULAR TOTALES FINALES
    const saldoEcoFinal = movimientosEconomicos.length > 0
        ? movimientosEconomicos[movimientosEconomicos.length - 1].SaldoEco
        : saldoEcoInicial;
    const saldoMatFinal = movimientosMateriales.length > 0
        ? movimientosMateriales[movimientosMateriales.length - 1].SaldoMat
        : saldoMatInicial;


    htmlFilas += `
        <tr class="fila-final">
            <!-- LADO ECONOMICO -->
            <td colspan="4" class="celda-final-titulo">TOTAL ECONÓMICO:</td>
            <td colspan="2" class="celda-final-monto">S/. ${Number(saldoEcoFinal).toFixed(2)}</td>

            <!-- LADO MATERIAL -->
            <td colspan="4" class="celda-final-titulo">TOTAL MATERIAL:</td>
            <td colspan="2" class="celda-final-monto">${Number(saldoMatFinal).toFixed(0)} g</td>
        </tr>
    `;

    return `
        ${GenerarLeyenda()}
        <div class="ContenedorTablaUnificada">
            <table class="TablaUnificada">
                <thead>
                    <!-- Primera fila: Cabeceras Grandes con SALDO INICIAL -->
                    <tr>
                        <th colspan="6" class="header-grande header-eco">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span><span style="margin-right: 10px;">💵</span> CAPITAL ECONÓMICO (S/)</span>
                                <span class="saldo-inicial-header">INICIO: S/. ${Number(saldoEcoInicial).toFixed(2)}</span>
                            </div>
                        </th>
                        <th colspan="6" class="header-grande header-mat">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span><span style="margin-right: 10px;">🪙</span> CAPITAL MATERIAL (g)</span>
                                <span class="saldo-inicial-header">INICIO: ${Number(saldoMatInicial).toFixed(2)} g</span>
                            </div>
                        </th>
                    </tr>
                    <!-- Segunda fila: Subcabeceras Idénticas -->
                    <tr>
                        <!-- Lado Eco -->
                        <th class="sub-header col-num">#</th>
                        <th class="sub-header">Hora</th>
                        <th class="sub-header col-tipo">Tipo</th>
                        <th class="sub-header">Cliente</th>
                        <th class="sub-header">Monto</th>
                        <th class="sub-header">Total Capital</th>

                        <!-- Lado Mat -->
                        <th class="sub-header col-num">#</th>
                        <th class="sub-header">Hora</th>
                        <th class="sub-header col-tipo">Tipo</th>
                        <th class="sub-header">Cliente</th>
                        <th class="sub-header">Monto</th>
                        <th class="sub-header">Total Capital</th>
                    </tr>
                </thead>
                <tbody>
                    ${htmlFilas}
                </tbody>
            </table>
        </div>
    `;
}

function GenerarEstilos() {
    return `
        <style>
            /* Layout General */
            .DetallesDiaContenedor {
                width: 90% !important; /* REDUCIDO DE 98% a 90% */
                max-width: 1350px !important; /* REDUCIDO DE 1600px */
                height: 90vh;
                display: flex;
                flex-direction: column;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                overflow: hidden;
            }

            .DetallesDiaBody {
                flex: 1;
                overflow-y: auto;
                padding: 30px; 
                background-color: #f8f9fa; 
            }

            /* Columma Numeración Más Pequeña */
            .col-num {
                width: 25px !important;
                text-align: center;
                min-width: 25px;
                max-width: 25px;
            }
            
            /* Columna Tipo - Permitir salto de línea */
            .col-tipo {
                white-space: normal !important;
                word-wrap: break-word;
                line-height: 1.3;
                vertical-align: middle;
            }

            /* Leyenda */
            .ContenedorLeyenda {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 15px;
                padding: 15px;
                background-color: white;
                border-radius: 8px;
                justify-content: center; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
                border: 1px solid #eee;
            }
            .ItemLeyenda {
                display: flex;
                align-items: center;
                font-size: 13px; 
                color: #555;
                font-weight: 500;
            }
            .CuadroColor {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                margin-right: 8px;
                border: 1px solid #e0e0e0;
            }

             /* Colores Leyenda - COLORES MÁS DEFINIDOS (PROFESIONALES) */
            .color-empresa-eco { background-color: #c5e1a5; border-color: #aed581; } /* Light Green 200 */
            .color-empresa-mat { background-color: #e1bee7; border-color: #ce93d8; } /* Purple 200 */
            .color-cliente-eco { background-color: #fff59d; border-color: #fff176; } /* Yellow 200 */
            .color-cliente-mat { background-color: #eeeeee; border-color: #e0e0e0; } /* Grey 200 */
            .color-venta { background-color: #bbdefb; border-color: #90caf9; } /* Blue 200 */

            /* Tabla Unificada */
            .ContenedorTablaUnificada {
                background: white;
                width: 100%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
                border-radius: 8px; 
                overflow: hidden; 
                border: 1px solid #ddd;
            }

            .TablaUnificada {
                width: 100%;
                border-collapse: collapse;
                font-family: 'Segoe UI', system-ui, sans-serif;
                font-size: 13px; 
                table-layout: fixed; 
            }

            .TablaUnificada th, .TablaUnificada td {
                border: 1px solid #d0d0d0; 
                padding: 8px 10px; 
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 38px;
            }

            /* Cabeceras Superiores */
            .header-grande {
                text-align: left;
                padding: 12px 15px;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                border-bottom: none;
            }
            .header-eco { 
                background-color: #f1f8e9; 
                color: #2e7d32; 
                border-top: 4px solid #388e3c; 
            } 
            .header-mat { 
                background-color: #f3e5f5; 
                color: #7b1fa2;
                border-top: 4px solid #8e24aa; 
                border-left: 1px solid #d0d0d0; 
            }
            
            .saldo-inicial-header {
                font-size: 12px;
                background: #ffffff;
                color: #333;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: 700;
                text-transform: none; 
                border: 1px solid #ccc;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }

            /* Subcabeceras */
            .sub-header {
                background-color: #eeeeee; 
                color: #444;
                font-weight: 700;
                text-align: center;
                font-size: 12px;
                padding: 10px 5px;
                border-bottom: 2px solid #ccc;
            }

            /* Clases de Celdas */
            .celda-centrada { text-align: center; }
            .celda-izquierda { text-align: left; padding-left: 12px; }
            .celda-derecha { text-align: right; padding-right: 12px; }
            .texto-negrita { font-weight: 700; color: #222; }
            
            .texto-gris { color: #757575; font-weight: 600; } 

            /* COLORES DE FONDO SEGÚN TIPO */
            
            .celda-empresa-eco { background-color: #c5e1a5; color: #222; } 
            .celda-cliente-eco { background-color: #fff59d; color: #222; } 
            .celda-empresa-mat { background-color: #e1bee7; color: #222; } 
            .celda-cliente-mat { background-color: #eeeeee; color: #222; } 
            .celda-venta { background-color: #bbdefb; color: #222; } 
            .celda-venta { background-color: #bbdefb; color: #222; } 
            .celda-sin-movimiento { background-color: #ffffff; color: #777; }

            /* TEXT COLORS (MUST BE AFTER BACKGROUNDS) */
            .texto-verde { color: #1b5e20 !important; font-weight: 700; } 
            .texto-rojo { color: #b71c1c !important; font-weight: 700; }

            /* Fila Final (Totales) */
            .fila-final {
                background-color: #6930A4; 
                color: white;
            }
            .celda-final-titulo {
                text-align: right;
                font-weight: normal;
                padding-right: 15px;
                font-size: 13px;
                border-top: none;
            }
            .celda-final-monto {
                text-align: right;
                font-weight: bold;
                font-size: 15px;
                padding-right: 20px;
                border-top: none;
            }

            /* Separador vertical central */
            /* Ahora la columna central es la 6 (porque son 6+6) */
            .TablaUnificada td:nth-child(6), 
            .TablaUnificada th:nth-child(6) {
                border-right: 2px solid #bdbdbd; 
            }

        </style>
    `;
}

function GenerarVentanaDetalles(datos) {
    const movimientosProcesados = ProcesarMovimientos(datos);

    return `
        ${GenerarEstilos()}
        <div class="DetallesDiaOverlay" id="DetallesDiaOverlay">
            <div class="DetallesDiaContenedor">
                <div class="DetallesDiaHeader">
                    <h2>Reporte Diario: ${datos.fecha}</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="BotonDescargar" id="BotonDescargarPDF">
                            📄 Exportar PDF
                        </button>
                        <button class="CerrarDetalles" id="CerrarDetalles">×</button>
                    </div>
                </div>
                <div class="DetallesDiaBody">
                    ${GenerarTablaUnificada(
        movimientosProcesados,
        parseFloat(datos.capitalEconomicoInicial || 0),
        parseFloat(datos.capitalMaterialInicial || 0)
    )}
                </div>
            </div>
        </div>
    `;
}

// Función -> cerrar ventana de detalles
function CerrarVentanaDetalles() {
    const overlay = document.getElementById("DetallesDiaOverlay");
    if (overlay) {
        overlay.remove();
    }
    DatosActuales = null;
}

// Función -> mostrar ventana de detalles
function MostrarDetallesDia(datos) {
    console.log("DetallesDia: Mostrando detalles del día con diseño refinado");

    // Guardar datos actuales
    DatosActuales = datos;

    // Obtener el espacio de contenido principal
    const contenedor = document.getElementById("VentanaPrincipal");
    if (!contenedor) {
        console.error("DetallesDia: No se encontró el contenedor principal");
        return;
    }

    // Generar y agregar el HTML
    const html = GenerarVentanaDetalles(datos);
    contenedor.insertAdjacentHTML('beforeend', html);

    // Agregar event listeners
    const botonCerrar = document.getElementById("CerrarDetalles");
    const overlay = document.getElementById("DetallesDiaOverlay");

    if (botonCerrar) {
        botonCerrar.addEventListener('click', CerrarVentanaDetalles);
    }

    const botonDescargarPDF = document.getElementById("BotonDescargarPDF");
    if (botonDescargarPDF) {
        botonDescargarPDF.addEventListener('click', () => {
            if (DatosActuales) {
                console.log("DetallesDia: Solicitando exportación PDF...");
                ipcRenderer.send("EExportarDetallesDiaPDF", DatosActuales);
            } else {
                console.error("DetallesDia: No hay datos para exportar a PDF");
            }
        });
    }

    if (overlay) {
        // Cerrar al hacer clic fuera del contenedor
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                CerrarVentanaDetalles();
            }
        });
    }
}

// Evento -> recibir datos de detalles del día
ipcRenderer.on("EMostrarDetallesDia", (event, datos) => {
    console.log("DetallesDia: Recibiendo datos:", datos);
    MostrarDetallesDia(datos);
});

// Exportar funciones
module.exports = {
    MostrarDetallesDia,
    CerrarVentanaDetalles
};
