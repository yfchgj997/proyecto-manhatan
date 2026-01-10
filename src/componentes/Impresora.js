const fs = require('fs'); // Módulo para manejar archivos
const PDFDocument = require('pdfkit'); // Módulo para generar PDFs
const { exec } = require('child_process'); // Para ejecutar comandos en el sistema

// Variables

let TamanoPapel = {
    "Ancho": 226,
    "Alto": 1000
}

let Margen = {
    "top": 10,
    "left": 10,
    "right": 10,
    "bottom": 10
}

let DocumentoPDF
let NombreDocumento

// Funciones

// Funcion -> traducir un numero
function Traducir(numero) {
    if (isNaN(numero)) return "Número inválido";

    const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    function convertirMenosDeMil(n) {
        if (n === 0) return "CERO";
        if (n < 10) return unidades[n];
        if (n < 20) return especiales[n - 10];
        if (n < 100) {
            return decenas[Math.floor(n / 10)] + (n % 10 !== 0 ? " Y " + unidades[n % 10] : "");
        }
        if (n === 100) return "CIEN";
        return centenas[Math.floor(n / 100)] + (n % 100 !== 0 ? " " + convertirMenosDeMil(n % 100) : "");
    }

    function convertirMiles(n) {
        if (n < 1000) return convertirMenosDeMil(n);
        if (n < 2000) return "MIL " + convertirMenosDeMil(n % 1000);
        return convertirMenosDeMil(Math.floor(n / 1000)) + " MIL" + (n % 1000 !== 0 ? " " + convertirMenosDeMil(n % 1000) : "");
    }

    function convertirMillones(n) {
        if (n < 1000000) return convertirMiles(n);
        if (n < 2000000) return "UN MILLÓN " + convertirMiles(n % 1000000);
        return convertirMiles(Math.floor(n / 1000000)) + " MILLONES" + (n % 1000000 !== 0 ? " " + convertirMiles(n % 1000000) : "");
    }

    // Manejo de números decimales
    let entero = Math.floor(numero);
    let decimal = Math.round((numero - entero) * 100); // Obtener los decimales como número entero

    let textoEntero = convertirMillones(entero).trim();
    let textoDecimal = decimal.toString().padStart(2, '0') + "/100 "; // Formato de decimales

    return `${textoEntero} y ${textoDecimal}`;
}


// Funcion -> Imprimir compra venta
function ImprimirCompraVenta(Movimiento) {

    // mensaje de flujo
    console.log("Impresora: Imprimiendo la siguiente compra venta: ")
    console.log(Movimiento)

    // Paso -> generar el documento pdf vacio
    DocumentoPDF = new PDFDocument({
        size: [TamanoPapel.Ancho, TamanoPapel.Alto],
        margins: {
            "top": Margen.top,
            "left": Margen.left,
            "right": Margen.right,
            "bottom": Margen.bottom
        }
    })

    // Paso -> asignarle un nombre
    NombreDocumento = "BoletaCompraVenta.pdf"
    const stream = fs.createWriteStream(NombreDocumento)
    DocumentoPDF.pipe(stream)

    // Paso -> obtener tipo valido
    let TipoValido
    if (Movimiento.tipo == "venta") {
        TipoValido = "VENTA"
    } else {
        TipoValido = "COMPRA"
    }

    // Paso -> colocar texto en el documento
    DocumentoPDF

        // Cabezera de boleta 
        .fontSize(10)
        .text('INVERSIONES REDSUR', { align: 'center', bold: true })
        .text('(HUEPETUHE)', { align: 'center' })

        .moveDown()// espacio o linea blanca

        // detalles de boleta 
        .text(`Referencia: ${Movimiento.ID}`)
        .text(`Fecha: ${Movimiento.Fecha}`)
        .text(`Hora: ${Movimiento.Hora}`)

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`======= BOLETA DE ${TipoValido} =======`, { align: 'center' })

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        //.text(`Admin: ${Movimiento.EmpleadoNombre}`)

        .text(`Cliente:  ${Movimiento.Cliente || (Movimiento.ClienteNombres + ' ' + (Movimiento.ClienteApellidos || ''))}`)
        .text(`Cant. Material: ${Movimiento.MontoMaterial} g.`)
        .text(`Val. Cambio: ${Movimiento.PrecioCambio} S/.`)
        .text(`Cant. Dinero: ${Movimiento.MontoEconomico} S/.`)
        .text(`Son: ${Traducir(Movimiento.MontoEconomico)} NUEVOS SOLES`)

        .moveDown()// espacio o linea blanca

        .text('=================================', { align: 'center' })
        .moveDown()// espacio o linea blanca

        .text(`IMPORTE: ${Movimiento.MontoEconomico} S/.`, { align: 'right' })


        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`_______________         _______________`, { align: 'center' })
        //.text(`CAJERO: ${Movimiento.EmpleadoNombre}           CLIENTE: ${Movimiento.Cliente}`);
        .text(`CAJERO                      CLIENTE`, { align: 'center' });


    DocumentoPDF.end();


    // Paso -> guardar el pdf cuando se termine de escribir
    stream.on('finish', () => {

        // mensaje de flujo
        console.log(`Impresora: el pdf se genero con exito ${NombreDocumento}`);

        // Paso -> abrir automáticamente el archivo después de crearlo
        const command = process.platform === 'win32' ? `start "" "${NombreDocumento}"` : process.platform === 'darwin' ? `open "${NombreDocumento}"` : `xdg-open "${NombreDocumento}"`;
        exec(command, (err) => {
            if (err) {
                console.log("Impresora: hubo un error al abrir el pdf");
            } else {
                console.log("Impresora: el pdf se abrio sin problemas");
            }
        });
    });

    stream.on('error', (error) => console.log("Impresora: error con el stream"));

}

// Funcion -> Imprimir compra venta
function ImprimirMovimientoEconomico(Movimiento) {

    // mensaje de flujo
    console.log("Impresora: Imprimiendo el siguiente movimiento economico: ")
    console.log(Movimiento)

    // Paso -> generar el documento pdf vacio
    DocumentoPDF = new PDFDocument({
        size: [TamanoPapel.Ancho, TamanoPapel.Alto],
        margins: {
            "top": Margen.top,
            "left": Margen.left,
            "right": Margen.right,
            "bottom": Margen.bottom
        }
    })

    // Paso -> asignarle un nombre
    NombreDocumento = "BoletaMovimientoEconomico.pdf"
    const stream = fs.createWriteStream(NombreDocumento)
    DocumentoPDF.pipe(stream)

    // Paso -> obtener tipo valido
    let TipoValido
    if (Movimiento.Tipo == "Ingreso") {
        TipoValido = "INGRESO"
    } else {
        TipoValido = "RETIRO"
    }

    // Paso -> colocar texto en el documento
    DocumentoPDF

        // Cabezera de boleta 
        .fontSize(10)
        .text('INVERSIONES REDSUR', { align: 'center', bold: true })
        .text('(HUEPETUHE)', { align: 'center' })

        .moveDown()// espacio o linea blanca

        // detalles de boleta 
        .text(`Referencia: ${Movimiento.ID}`)
        .text(`Fecha: ${Movimiento.Fecha}`)
        .text(`Hora: ${Movimiento.Hora}`)

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`======= BOLETA DE ${TipoValido} =======`, { align: 'center' })

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        //.text(`Empleado: ${Movimiento.UsuarioNombres}`)

        .text(`Cliente:  ${Movimiento.ClienteNombres} ${Movimiento.ClienteApellidos || ''}`)
        .text(`Recibí de: ${Movimiento.Observacion}`)
        .text(`Importe: ${Movimiento.Importe} S/.`)
        .text(`Son: ${Traducir(Movimiento.Importe)} NUEVOS SOLES`)

        .moveDown()// espacio o linea blanca

        .text('=================================', { align: 'center' })
        .moveDown()// espacio o linea blanca

        .text(`IMPORTE: ${Movimiento.Importe} S/.`, { align: 'right' })


        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`_______________         _______________`, { align: 'center' })
        //.text(`CAJERO: ${Movimiento.UsuarioNombres}           CLIENTE: ${Movimiento.ClienteNombres}`);
        .text(`CAJERO                      CLIENTE`, { align: 'center' });


    DocumentoPDF.end();


    // Paso -> guardar el pdf cuando se termine de escribir
    stream.on('finish', () => {

        // mensaje de flujo
        console.log(`Impresora: el pdf se genero con exito ${NombreDocumento}`);

        // Paso -> abrir automáticamente el archivo después de crearlo
        const command = process.platform === 'win32' ? `start "" "${NombreDocumento}"` : process.platform === 'darwin' ? `open "${NombreDocumento}"` : `xdg-open "${NombreDocumento}"`;
        exec(command, (err) => {
            if (err) {
                console.log("Impresora: hubo un error al abrir el pdf");
            } else {
                console.log("Impresora: el pdf se abrio sin problemas");
            }
        });
    });

    stream.on('error', (error) => console.log("Impresora: error con el stream"));

}

// Funcion -> Imprimir compra venta
function ImprimirMovimientoMaterial(Movimiento) {

    // mensaje de flujo
    console.log("Impresora: Imprimiendo el siguiente movimiento material: ")
    console.log(Movimiento)

    // Paso -> generar el documento pdf vacio
    DocumentoPDF = new PDFDocument({
        size: [TamanoPapel.Ancho, TamanoPapel.Alto],
        margins: {
            "top": Margen.top,
            "left": Margen.left,
            "right": Margen.right,
            "bottom": Margen.bottom
        }
    })

    // Paso -> asignarle un nombre
    NombreDocumento = "BoletaMovimientoMaterial.pdf"
    const stream = fs.createWriteStream(NombreDocumento)
    DocumentoPDF.pipe(stream)

    // Paso -> obtener tipo valido
    let TipoValido
    if (Movimiento.Tipo == "Ingreso") {
        TipoValido = "INGRESO"
    } else {
        TipoValido = "RETIRO"
    }

    // Paso -> colocar texto en el documento
    DocumentoPDF

        // Cabezera de boleta 
        .fontSize(10)
        .text('INVERSIONES REDSUR', { align: 'center', bold: true })
        .text('(HUEPETUHE)', { align: 'center' })

        .moveDown()// espacio o linea blanca

        // detalles de boleta 
        .text(`Referencia: ${Movimiento.ID}`)
        .text(`Fecha: ${Movimiento.Fecha}`)
        .text(`Hora: ${Movimiento.Hora}`)

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`======= BOLETA DE ${TipoValido} =======`, { align: 'center' })

        .moveDown()// espacio o linea blanca

        .fontSize(10)
        //.text(`Empleado: ${Movimiento.UsuarioNombres}`)

        .text(`Cliente:  ${Movimiento.ClienteNombres} ${Movimiento.ClienteApellidos || ''}`)
        .text(`Recibí de: ${Movimiento.Observacion}`)
        .text(`Importe: ${Movimiento.Importe} g.`)
        .text(`Son: ${Traducir(Movimiento.Importe)} GRAMOS`)

        .moveDown()// espacio o linea blanca

        .text('=================================', { align: 'center' })
        .moveDown()// espacio o linea blanca

        .text(`IMPORTE: ${Movimiento.Importe} g.`, { align: 'right' })


        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca
        .moveDown()// espacio o linea blanca

        .fontSize(10)
        .text(`_______________         _______________`, { align: 'center' })
        .text(`CAJERO                      CLIENTE`, { align: 'center' });
    //.text(`CAJERO: ${Movimiento.UsuarioNombres}           CLIENTE: ${Movimiento.ClienteNombres}`);


    DocumentoPDF.end();


    // Paso -> guardar el pdf cuando se termine de escribir
    stream.on('finish', () => {

        // mensaje de flujo
        console.log(`Impresora: el pdf se genero con exito ${NombreDocumento}`);

        // Paso -> abrir automáticamente el archivo después de crearlo
        const command = process.platform === 'win32' ? `start "" "${NombreDocumento}"` : process.platform === 'darwin' ? `open "${NombreDocumento}"` : `xdg-open "${NombreDocumento}"`;
        exec(command, (err) => {
            if (err) {
                console.log("Impresora: hubo un error al abrir el pdf");
            } else {
                console.log("Impresora: el pdf se abrio sin problemas");
            }
        });
    });

    stream.on('error', (error) => console.log("Impresora: error con el stream"));

}

// Funcion -> Exportar Detalles Dia a PDF (EXACTAMENTE COMO LA TABLA UI)
function ExportarDetallesDiaPDF(datos) {
    console.log("Impresora: Generando PDF de Detalles del Día...");
    console.log(datos);

    // ===== PROCESAR DATOS IGUAL QUE EN DetallesDia.js =====
    function ProcesarMovimientos(datos) {
        const movimientos = datos.movimientos || [];
        const movEmpresariales = datos.movimientosEmpresariales || [];
        let listaUnificada = [];

        // 1. Unificar Movimientos de Clientes y Ventas
        movimientos.forEach(m => {
            let item = {
                Fecha: m.Fecha,
                Hora: m.Hora || "00:00:00",
                TipoOriginal: m.Tipo,
                Registro: m.Registro,
                Cliente: m.ClienteN || m.ClienteNombres || m.Cliente || "Desconocido",
                Observacion: m.Observacion || "",
                EcoIngreso: 0,
                EcoEgreso: 0,
                MatIngreso: 0,
                MatEgreso: 0,
                EsVenta: false,
                EsEmpresarial: false
            };

            let importeOperacion = 0;
            let pesoOperacion = 0;

            if (m.Registro === "Economico") {
                importeOperacion = parseFloat(m.Importe || 0);
                if (m.Tipo === "Ingreso") item.EcoIngreso = importeOperacion;
                else if (m.Tipo === "Retiro") item.EcoEgreso = importeOperacion;
            }
            else if (m.Registro === "Material") {
                pesoOperacion = parseFloat(m.Importe || 0);
                if (m.Tipo === "Ingreso") item.MatIngreso = pesoOperacion;
                else if (m.Tipo === "Retiro") item.MatEgreso = pesoOperacion;
            }
            else if (m.Registro === "VentaOcasional") {
                item.EsVenta = true;
                importeOperacion = parseFloat(m.MontoEconomico || m.Importe || 0);
                pesoOperacion = parseFloat(m.MontoMaterial || m.Peso || 0);

                if (m.Tipo === "compra" || m.Tipo === "Compra") {
                    item.MatIngreso = pesoOperacion;
                    item.EcoEgreso = importeOperacion;
                }
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
                TipoOriginal: m.Operacion,
                Registro: "Empresarial",
                Cliente: "EMPRESA",
                Observacion: m.Detalle || "",
                EcoIngreso: 0,
                EcoEgreso: 0,
                MatIngreso: 0,
                MatEgreso: 0,
                EsVenta: false,
                EsEmpresarial: true,
                TipoEmpresarial: m.Tipo
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
        let saldoEco = parseFloat(datos.capitalEconomicoInicial || 0);
        let saldoMat = parseFloat(datos.capitalMaterialInicial || 0);

        listaUnificada.forEach(item => {
            saldoEco = saldoEco + item.EcoIngreso - item.EcoEgreso;
            saldoMat = saldoMat + item.MatIngreso - item.MatEgreso;
            item.SaldoEco = saldoEco;
            item.SaldoMat = saldoMat;
        });

        return listaUnificada;
    }

    // Procesar movimientos - SEPARAR EN DOS LISTAS INDEPENDIENTES
    const lista = ProcesarMovimientos(datos);
    const saldoEcoInicial = parseFloat(datos.capitalEconomicoInicial || 0);
    const saldoMatInicial = parseFloat(datos.capitalMaterialInicial || 0);

    // SEPARAR MOVIMIENTOS EN DOS LISTAS INDEPENDIENTES (igual que UI)
    let movimientosEconomicos = [];
    let movimientosMateriales = [];

    lista.forEach((item) => {
        const tieneMovEconomico = item.EcoIngreso !== 0 || item.EcoEgreso !== 0;
        const tieneMovMaterial = item.MatIngreso !== 0 || item.MatEgreso !== 0;

        if (tieneMovEconomico || item.EsVenta) {
            movimientosEconomicos.push(item);
        }

        if (tieneMovMaterial || item.EsVenta) {
            movimientosMateriales.push(item);
        }
    });

    // Determinar número máximo de filas
    const maxFilas = Math.max(movimientosEconomicos.length, movimientosMateriales.length);

    // Crear documento PDF en formato horizontal (landscape)
    DocumentoPDF = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 30, left: 30, right: 30, bottom: 30 }
    });

    // Nombre del archivo
    const fecha = datos.fecha || 'sin-fecha';
    NombreDocumento = `Reporte_Diario_${fecha.replace(/\//g, '-')}.pdf`;
    const stream = fs.createWriteStream(NombreDocumento);
    DocumentoPDF.pipe(stream);

    // Colores (IGUALES A LA UI)
    const colores = {
        empresaEco: '#c5e1a5',
        empresaMat: '#e1bee7',
        clienteEco: '#fff59d',
        clienteMat: '#eeeeee',
        venta: '#bbdefb',
        sinMov: '#ffffff'
    };

    // HEADER
    DocumentoPDF
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('INVERSIONES DUBAI', { align: 'center' })
        .fontSize(12)
        .text('RESUMEN DE MOVIMIENTOS DIARIOS', { align: 'center' })
        .fontSize(9)
        .font('Helvetica')
        .text(`Fecha: ${fecha}`, { align: 'center' })
        .moveDown(0.5);

    // Configuración de tabla
    const pageWidth = 842;
    const margin = 30;
    const tableWidth = pageWidth - (margin * 2);
    const colWidths = [25, 50, 90, 110, 80, 80]; // #, Hora, Tipo, Cliente, Monto, Total
    const totalCols = colWidths.reduce((a, b) => a + b, 0);
    const scaleFactor = (tableWidth / 2) / totalCols;
    const scaledWidths = colWidths.map(w => w * scaleFactor);

    let currentY = DocumentoPDF.y;

    // Función auxiliar para dibujar celda
    function dibujarCelda(x, y, width, height, text, options = {}) {
        const { bgColor = '#ffffff', textColor = '#000000', fontSize = 8, align = 'center', bold = false } = options;

        // Fondo
        DocumentoPDF.rect(x, y, width, height).fillAndStroke(bgColor, '#d0d0d0');

        // Texto
        DocumentoPDF
            .fillColor(textColor)
            .fontSize(fontSize)
            .font(bold ? 'Helvetica-Bold' : 'Helvetica');

        const textY = y + (height / 2) - (fontSize / 2);
        const textOptions = {
            width: width - 4,
            align: align,
            lineBreak: true,
            height: height - 4
        };

        DocumentoPDF.text(text, x + 2, textY, textOptions);
    }

    // CABECERA DE TABLA
    const headerHeight = 20;
    const subHeaderHeight = 18;

    // Headers principales
    let xPos = margin;
    const halfWidth = scaledWidths.reduce((a, b) => a + b, 0);

    dibujarCelda(xPos, currentY, halfWidth, headerHeight, ` CAPITAL ECONÓMICO (S/) - INICIO: S/. ${saldoEcoInicial.toFixed(2)}`,
        { bgColor: '#f1f8e9', textColor: '#2e7d32', fontSize: 9, bold: true });
    dibujarCelda(xPos + halfWidth, currentY, halfWidth, headerHeight, ` CAPITAL MATERIAL (g) - INICIO: ${saldoMatInicial.toFixed(0)} g`,
        { bgColor: '#f3e5f5', textColor: '#7b1fa2', fontSize: 9, bold: true });

    currentY += headerHeight;

    // Sub-headers
    const headers = ['#', 'Hora', 'Tipo', 'Cliente', 'Monto', 'Total'];

    // Lado Económico
    xPos = margin;
    headers.forEach((header, i) => {
        dibujarCelda(xPos, currentY, scaledWidths[i], subHeaderHeight, header,
            { bgColor: '#eeeeee', fontSize: 8, bold: true });
        xPos += scaledWidths[i];
    });

    // Lado Material
    headers.forEach((header, i) => {
        dibujarCelda(xPos, currentY, scaledWidths[i], subHeaderHeight, header,
            { bgColor: '#eeeeee', fontSize: 8, bold: true });
        xPos += scaledWidths[i];
    });

    currentY += subHeaderHeight;

    // DATOS (LÓGICA DE COLUMNAS INDEPENDIENTES)
    const rowHeight = 25;

    for (let i = 0; i < maxFilas; i++) {
        // Verificar si necesitamos nueva página
        if (currentY + rowHeight > 555) {
            DocumentoPDF.addPage({ size: 'A4', layout: 'landscape', margins: { top: 30, left: 30, right: 30, bottom: 30 } });
            currentY = 30;

            // Repetir headers
            xPos = margin;
            dibujarCelda(xPos, currentY, halfWidth, headerHeight, ` CAPITAL ECONÓMICO (S/)`,
                { bgColor: '#f1f8e9', textColor: '#2e7d32', fontSize: 9, bold: true });
            dibujarCelda(xPos + halfWidth, currentY, halfWidth, headerHeight, ` CAPITAL MATERIAL (g)`,
                { bgColor: '#f3e5f5', textColor: '#7b1fa2', fontSize: 9, bold: true });
            currentY += headerHeight;

            xPos = margin;
            headers.forEach((header, j) => {
                dibujarCelda(xPos, currentY, scaledWidths[j], subHeaderHeight, header,
                    { bgColor: '#eeeeee', fontSize: 8, bold: true });
                xPos += scaledWidths[j];
            });
            xPos = margin + halfWidth;
            headers.forEach((header, j) => {
                dibujarCelda(xPos, currentY, scaledWidths[j], subHeaderHeight, header,
                    { bgColor: '#eeeeee', fontSize: 8, bold: true });
                xPos += scaledWidths[j];
            });
            currentY += subHeaderHeight;
        }

        const movEco = movimientosEconomicos[i];
        const movMat = movimientosMateriales[i];

        // LADO ECONÓMICO
        xPos = margin;
        if (movEco) {
            const num = String(i + 1).padStart(2, '0');
            const horaStr = movEco.Hora.substring(0, 5);
            const clienteStr = movEco.Cliente;
            const totalEcoStr = `S/. ${Number(movEco.SaldoEco).toFixed(2)}`;

            // Descripción de tipo
            let tipoDescripcion = "-";
            if (movEco.EsEmpresarial) {
                if (movEco.TipoEmpresarial === "Capital") tipoDescripcion = "MOV. EMPRESARIAL ECONÓMICO";
            }
            else if (movEco.EsVenta) {
                if (movEco.TipoOriginal.toLowerCase() === "venta") tipoDescripcion = "VENTA DE ORO";
                else if (movEco.TipoOriginal.toLowerCase() === "compra") tipoDescripcion = "COMPRA DE ORO";
                else tipoDescripcion = "VENTA OCASIONAL";
            }
            else {
                if (movEco.Registro === "Economico") tipoDescripcion = "MOVIMIENTO ECONÓMICO";
            }

            // Color
            let bgColor = colores.sinMov;
            if (movEco.EsEmpresarial && movEco.TipoEmpresarial === "Capital") bgColor = colores.empresaEco;
            else if (movEco.EsVenta) bgColor = colores.venta;
            else if (movEco.Registro === "Economico") bgColor = colores.clienteEco;

            // Monto
            const montoEcoStr = movEco.EcoIngreso > 0 ? `+ S/. ${movEco.EcoIngreso.toFixed(2)}` : `- S/. ${movEco.EcoEgreso.toFixed(2)}`;
            const colorMonto = movEco.EcoIngreso > 0 ? '#1b5e20' : '#b71c1c';

            dibujarCelda(xPos, currentY, scaledWidths[0], rowHeight, num, { bgColor, fontSize: 7 });
            xPos += scaledWidths[0];
            dibujarCelda(xPos, currentY, scaledWidths[1], rowHeight, horaStr, { bgColor, fontSize: 7 });
            xPos += scaledWidths[1];
            dibujarCelda(xPos, currentY, scaledWidths[2], rowHeight, tipoDescripcion, { bgColor, fontSize: 6 });
            xPos += scaledWidths[2];
            dibujarCelda(xPos, currentY, scaledWidths[3], rowHeight, clienteStr, { bgColor, fontSize: 7, align: 'left' });
            xPos += scaledWidths[3];
            dibujarCelda(xPos, currentY, scaledWidths[4], rowHeight, montoEcoStr, { bgColor, fontSize: 7, textColor: colorMonto, align: 'right' });
            xPos += scaledWidths[4];
            dibujarCelda(xPos, currentY, scaledWidths[5], rowHeight, totalEcoStr, { bgColor, fontSize: 7, bold: true, align: 'right' });
            xPos += scaledWidths[5];
        } else {
            // Celda vacía
            for (let j = 0; j < 6; j++) {
                dibujarCelda(xPos, currentY, scaledWidths[j], rowHeight, '', { bgColor: colores.sinMov, fontSize: 7 });
                xPos += scaledWidths[j];
            }
        }

        // LADO MATERIAL
        if (movMat) {
            const num = String(i + 1).padStart(2, '0');
            const horaStr = movMat.Hora.substring(0, 5);
            const clienteStr = movMat.Cliente;
            const totalMatStr = `${Number(movMat.SaldoMat).toFixed(0)} g`;

            // Descripción de tipo
            let tipoDescripcion = "-";
            if (movMat.EsEmpresarial) {
                if (movMat.TipoEmpresarial === "Material") tipoDescripcion = "MOV. EMPRESARIAL MATERIAL";
            }
            else if (movMat.EsVenta) {
                if (movMat.TipoOriginal.toLowerCase() === "venta") tipoDescripcion = "VENTA DE ORO";
                else if (movMat.TipoOriginal.toLowerCase() === "compra") tipoDescripcion = "COMPRA DE ORO";
                else tipoDescripcion = "VENTA OCASIONAL";
            }
            else {
                if (movMat.Registro === "Material") tipoDescripcion = "MOVIMIENTO MATERIAL";
            }

            // Color
            let bgColor = colores.sinMov;
            if (movMat.EsEmpresarial && movMat.TipoEmpresarial === "Material") bgColor = colores.empresaMat;
            else if (movMat.EsVenta) bgColor = colores.venta;
            else if (movMat.Registro === "Material") bgColor = colores.clienteMat;

            // Monto
            const montoMatStr = movMat.MatIngreso > 0 ? `+ ${movMat.MatIngreso} g` : `- ${movMat.MatEgreso} g`;
            const colorMonto = movMat.MatIngreso > 0 ? '#1b5e20' : '#b71c1c';

            dibujarCelda(xPos, currentY, scaledWidths[0], rowHeight, num, { bgColor, fontSize: 7 });
            xPos += scaledWidths[0];
            dibujarCelda(xPos, currentY, scaledWidths[1], rowHeight, horaStr, { bgColor, fontSize: 7 });
            xPos += scaledWidths[1];
            dibujarCelda(xPos, currentY, scaledWidths[2], rowHeight, tipoDescripcion, { bgColor, fontSize: 6 });
            xPos += scaledWidths[2];
            dibujarCelda(xPos, currentY, scaledWidths[3], rowHeight, clienteStr, { bgColor, fontSize: 7, align: 'left' });
            xPos += scaledWidths[3];
            dibujarCelda(xPos, currentY, scaledWidths[4], rowHeight, montoMatStr, { bgColor, fontSize: 7, textColor: colorMonto, align: 'right' });
            xPos += scaledWidths[4];
            dibujarCelda(xPos, currentY, scaledWidths[5], rowHeight, totalMatStr, { bgColor, fontSize: 7, bold: true, align: 'right' });
        } else {
            // Celda vacía
            for (let j = 0; j < 6; j++) {
                dibujarCelda(xPos, currentY, scaledWidths[j], rowHeight, '', { bgColor: colores.sinMov, fontSize: 7 });
                xPos += scaledWidths[j];
            }
        }

        currentY += rowHeight;
    }

    // FOOTER - Totales finales
    currentY += 5;
    const footerHeight = 22;

    xPos = margin;
    const footerColSpan = scaledWidths[0] + scaledWidths[1] + scaledWidths[2] + scaledWidths[3];
    const footerValueSpan = scaledWidths[4] + scaledWidths[5];

    const saldoEcoFinal = movimientosEconomicos.length > 0 ? movimientosEconomicos[movimientosEconomicos.length - 1].SaldoEco : saldoEcoInicial;
    const saldoMatFinal = movimientosMateriales.length > 0 ? movimientosMateriales[movimientosMateriales.length - 1].SaldoMat : saldoMatInicial;

    // Total Económico
    dibujarCelda(xPos, currentY, footerColSpan, footerHeight, 'TOTAL ECONÓMICO:',
        { bgColor: '#6930A4', textColor: '#ffffff', fontSize: 10, align: 'right', bold: true });
    xPos += footerColSpan;
    dibujarCelda(xPos, currentY, footerValueSpan, footerHeight, `S/. ${saldoEcoFinal.toFixed(2)}`,
        { bgColor: '#6930A4', textColor: '#ffffff', fontSize: 11, bold: true, align: 'right' });
    xPos += footerValueSpan;

    // Total Material
    dibujarCelda(xPos, currentY, footerColSpan, footerHeight, 'TOTAL MATERIAL:',
        { bgColor: '#6930A4', textColor: '#ffffff', fontSize: 10, align: 'right', bold: true });
    xPos += footerColSpan;
    dibujarCelda(xPos, currentY, footerValueSpan, footerHeight, `${saldoMatFinal.toFixed(0)} g`,
        { bgColor: '#6930A4', textColor: '#ffffff', fontSize: 11, bold: true, align: 'right' });

    DocumentoPDF.end();

    // Guardar y abrir
    stream.on('finish', () => {
        console.log(`Impresora: PDF generado con éxito - ${NombreDocumento}`);

        const command = process.platform === 'win32' ? `start "" "${NombreDocumento}"` :
            process.platform === 'darwin' ? `open "${NombreDocumento}"` :
                `xdg-open "${NombreDocumento}"`;
        exec(command, (err) => {
            if (err) {
                console.log("Impresora: Error al abrir el PDF");
            } else {
                console.log("Impresora: PDF abierto correctamente");
            }
        });
    });

    stream.on('error', (error) => console.log("Impresora: Error con el stream del PDF"));
}

module.exports = {
    ImprimirCompraVenta,
    ImprimirMovimientoEconomico,
    ImprimirMovimientoMaterial,
    ExportarDetallesDiaPDF
}