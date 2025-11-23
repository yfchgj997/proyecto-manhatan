const fs = require('fs');
const path = require('path');

// Mock fs.writeFileSync to intercept writes
const originalWriteFileSync = fs.writeFileSync;
let writeLog = [];

fs.writeFileSync = (file, data, options) => {
    console.log(`Intercepted write to ${path.basename(file)}`);
    writeLog.push({ file: path.basename(file), data: JSON.parse(data) });
    // Don't actually write to disk
};

// Mock fs.existsSync and readFileSync to avoid errors if files don't exist or are empty
// We'll just return a basic structure
const originalReadFileSync = fs.readFileSync;
const originalExistsSync = fs.existsSync;

fs.existsSync = (path) => true;
fs.readFileSync = (filePath, encoding) => {
    if (!filePath.endsWith('.json')) {
        return originalReadFileSync(filePath, encoding);
    }
    const fileName = path.basename(filePath);
    console.log(`Reading file: ${fileName}`);
    if (fileName === 'CapturaDeCuenta.json') {
        console.log('Returning mock CapturaDeCuenta');
        return JSON.stringify([]); // Array for CapturaDeCuenta
    } else if (fileName === 'CuentaEmpresarial.json') {
        console.log('Returning mock CuentaEmpresarial');
        return JSON.stringify({ CapitalEconomico: 1000, CapitalMaterial: 1000 });
    } else if (fileName === 'Cliente.json') {
        console.log('Returning mock Cliente');
        return JSON.stringify({ Elementos: [{ ID: 1, SaldoEconomico: 100, SaldoMaterial: 100 }], Contador: 1 });
    } else {
        console.log('Returning mock Default');
        return JSON.stringify({ Elementos: [], Contador: 0 });
    }
};

// Load modules
const MovimientoDeDinero = require('./src/objetos/MovimientoDeDinero/MovimientoDeDinero.js');
const MovimientoDeMaterial = require('./src/objetos/MovimientoDeMaterial/MovimientoDeMaterial.js');
const VentaOcasional = require('./src/objetos/VentaOcasional/VentaOcasional.js');

try {
    // Test MovimientoDeDinero
    console.log('Testing MovimientoDeDinero...');
    MovimientoDeDinero.GuardarMovimientoEconomico({
        Tipo: 'Ingreso',
        Importe: 10.5, // Should become "10.50"
        Fecha: '2023-10-27',
        ClienteID: 1
    });

    // Test MovimientoDeMaterial
    console.log('Testing MovimientoDeMaterial...');
    MovimientoDeMaterial.GuardarMovimientoMaterial({
        Tipo: 'Ingreso',
        Importe: 5, // Should become "5.00"
        Fecha: '2023-10-27',
        ClienteID: 1
    });

    // Test VentaOcasional
    console.log('Testing VentaOcasional...');
    VentaOcasional.GuardarVentaOcasional({
        Tipo: 'venta',
        MontoEconomico: 12.345, // Should become "12.35"
        MontoMaterial: 0, // Should become "0.00"
        Fecha: '2023-10-27'
    });
} catch (error) {
    console.error('Test failed:', error);
}

// Check results
console.log('\n--- Results ---');
writeLog.forEach(entry => {
    const elements = entry.data.Elementos;
    const lastElement = elements[elements.length - 1];
    console.log(`File: ${entry.file}`);
    if (entry.file === 'MovimientoDeDinero.json') {
        console.log(`Importe: "${lastElement.Importe}" (Expected "10.50")`);
    } else if (entry.file === 'MovimientoDeMaterial.json') {
        console.log(`Importe: "${lastElement.Importe}" (Expected "5.00")`);
    } else if (entry.file === 'VentaOcasional.json') {
        console.log(`MontoEconomico: "${lastElement.MontoEconomico}" (Expected "12.35")`);
        console.log(`MontoMaterial: "${lastElement.MontoMaterial}" (Expected "0.00")`);
    }
});
