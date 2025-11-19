const fs = require('fs'); // Módulo para manejar archivos
const PDFDocument = require('pdfkit'); // Módulo para generar PDFs
const { exec } = require('child_process'); // Para ejecutar comandos en el sistema

// Variables

    let TamanoPapel = {
        "Ancho":226,
        "Alto": 1000
    }

    let Margen = {
        "top":10,
        "left": 10,
        "right": 10,
        "bottom": 10
    }

    let DocumentoPDF
    let NombreDocumento

// Funciones

    // Funcion -> traducir un numero
    /*
    function Traducir(numero) {
        if (isNaN(numero) || !Number.isInteger(numero)) return "Número inválido";

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

        return convertirMillones(numero).trim();
    }*/

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
    function ImprimirCompraVenta (Movimiento){

        // mensaje de flujo
        console.log("Impresora: Imprimiendo la siguiente compra venta: ")
        console.log(Movimiento)

        // Paso -> generar el documento pdf vacio
        DocumentoPDF = new PDFDocument({
            size:[TamanoPapel.Ancho,TamanoPapel.Alto],
            margins:{
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
        if(Movimiento.tipo == "venta"){
            TipoValido = "VENTA"
        }else{
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
            .text(`Admin: ADMIN`)
            .text(`Cliente:  ${Movimiento.Cliente}`)
            .text(`Cant. Material: ${Movimiento.MontoMaterial} g.`)
            .text(`Val. Cambio: ${Movimiento.PrecioCambio} S/.`)
            .text(`Cant. Dinero: ${Movimiento.MontoEconomico} S/.`)
            .text(`Son: ${Traducir(Movimiento.MontoEconomico)} NUEVOS SOLES`)

            .moveDown()// espacio o linea blanca

            .text('=================================', { align: 'center' })
            .moveDown()// espacio o linea blanca

            .text(`IMPORTE: ${Movimiento.MontoEconomico} S/.`,{ align: 'right'})


            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca

            .fontSize(10)
            .text(`_______________         _______________`)
            //.text(`CAJERO: ${Movimiento.EmpleadoNombre}           CLIENTE: ${Movimiento.Cliente}`);
            .text(`CAJERO: ADMIN           CLIENTE: ${Movimiento.Cliente}`);

    
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
    function ImprimirMovimientoEconomico (Movimiento){

        // mensaje de flujo
        console.log("Impresora: Imprimiendo el siguiente movimiento economico: ")
        console.log(Movimiento)

        // Paso -> generar el documento pdf vacio
        DocumentoPDF = new PDFDocument({
            size:[TamanoPapel.Ancho,TamanoPapel.Alto],
            margins:{
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
        if(Movimiento.Tipo == "Ingreso"){
            TipoValido = "INGRESO"
        }else{
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
            .text(`Admin: ADMIN`)
            .text(`Cliente:  ${Movimiento.ClienteNombres}`)
            .text(`Observacion: ${Movimiento.Observacion}`)
            .text(`Importe: ${Movimiento.Importe} S/.`)
            .text(`Son: ${Traducir(Movimiento.Importe)} NUEVOS SOLES`)

            .moveDown()// espacio o linea blanca

            .text('=================================', { align: 'center' })
            .moveDown()// espacio o linea blanca

            .text(`IMPORTE: ${Movimiento.Importe} S/.`,{ align: 'right'})


            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca

            .fontSize(10)
            .text(`_______________         _______________`)
            //.text(`CAJERO: ${Movimiento.UsuarioNombres}           CLIENTE: ${Movimiento.ClienteNombres}`);
            .text(`CAJERO: ADMIN           CLIENTE: ${Movimiento.Cliente}`);

    
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
    function ImprimirMovimientoMaterial (Movimiento){

        // mensaje de flujo
        console.log("Impresora: Imprimiendo el siguiente movimiento material: ")
        console.log(Movimiento)

        // Paso -> generar el documento pdf vacio
        DocumentoPDF = new PDFDocument({
            size:[TamanoPapel.Ancho,TamanoPapel.Alto],
            margins:{
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
        if(Movimiento.Tipo == "Ingreso"){
            TipoValido = "INGRESO"
        }else{
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
            .text(`Admin: ADMIN`)
            .text(`Cliente:  ${Movimiento.ClienteNombres}`)
            .text(`Observacion: ${Movimiento.Observacion}`)
            .text(`Importe: ${Movimiento.Importe} g.`)
            .text(`Son: ${Traducir(Movimiento.Importe)} GRAMOS`)

            .moveDown()// espacio o linea blanca

            .text('=================================', { align: 'center' })
            .moveDown()// espacio o linea blanca

            .text(`IMPORTE: ${Movimiento.Importe} g.`,{ align: 'right'})


            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca
            .moveDown()// espacio o linea blanca

            .fontSize(10)
            .text(`_______________         _______________`)
            .text(`CAJERO: ADMIN           CLIENTE: ${Movimiento.Cliente}`);
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

module.exports = {
    ImprimirCompraVenta,
    ImprimirMovimientoEconomico,
    ImprimirMovimientoMaterial
}