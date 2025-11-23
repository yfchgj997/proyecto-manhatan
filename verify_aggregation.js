const CuentaEmpresarial = require('./src/objetos/CuentaEmpresarial/CuentaEmpresarial.js');
const Cliente = require('./src/objetos/Cliente/Cliente.js');
const fs = require('fs');
const path = require('path');

// Mock fs to avoid writing to actual files during verification
const originalWriteFileSync = fs.writeFileSync;
const originalReadFileSync = fs.readFileSync;
const originalExistsSync = fs.existsSync;

let mockFiles = {
    [path.join(__dirname, 'src/objetos/CuentaEmpresarial/CuentaEmpresarial.json')]: JSON.stringify({
        CapitalEconomico: 100.00,
        CapitalMaterial: 50.00
    }),
    [path.join(__dirname, 'src/objetos/Cliente/Cliente.json')]: JSON.stringify({
        Contador: 1,
        Elementos: [
            {
                ID: 1,
                Nombres: "Test",
                Apellidos: "User",
                SaldoEconomico: 100.00,
                SaldoMaterial: 50.00
            }
        ]
    })
};

fs.writeFileSync = (path, data) => {
    console.log(`[MOCK] Writing to ${path}: ${data}`);
    mockFiles[path] = data;
};

fs.readFileSync = (path, encoding) => {
    if (mockFiles[path]) {
        return mockFiles[path];
    }
    return originalReadFileSync(path, encoding);
};

fs.existsSync = (path) => {
    if (mockFiles[path]) {
        return true;
    }
    return originalExistsSync(path);
};

async function verifyAggregation() {
    console.log("Verifying Aggregation Logic...");

    try {
        // Test CuentaEmpresarial
        console.log("Testing CuentaEmpresarial...");

        // Initial state
        let initialCapital = CuentaEmpresarial.ObtenerCapitalEconomicoActual().CapitalEconomico;
        console.log(`Initial Capital: ${initialCapital}`);

        // Add amount (string)
        let amountToAdd = "50.50";
        CuentaEmpresarial.ModificarCapitalEconomico("aumentar", amountToAdd);

        let newCapital = CuentaEmpresarial.ObtenerCapitalEconomicoActual().CapitalEconomico;
        console.log(`New Capital (after adding ${amountToAdd}): ${newCapital}`);

        if (newCapital === 150.50) {
            console.log("SUCCESS: CuentaEmpresarial aggregation worked correctly (100 + 50.50 = 150.50)");
        } else {
            console.error(`FAILURE: CuentaEmpresarial aggregation failed. Expected 150.50, got ${newCapital}`);
        }

        // Test Cliente
        console.log("\nTesting Cliente...");

        // Initial state
        let initialSaldo = Cliente.ObtenerSaldo(1, "economico").SaldoEconomico;
        console.log(`Initial Saldo: ${initialSaldo}`);

        // Add amount (string)
        let amountToAddCliente = "25.25";
        Cliente.ModificarSaldoEconomico("Aumentar", amountToAddCliente, 1);

        let newSaldo = Cliente.ObtenerSaldo(1, "economico").SaldoEconomico;
        console.log(`New Saldo (after adding ${amountToAddCliente}): ${newSaldo}`);

        if (newSaldo === 125.25) {
            console.log("SUCCESS: Cliente aggregation worked correctly (100 + 25.25 = 125.25)");
        } else {
            console.error(`FAILURE: Cliente aggregation failed. Expected 125.25, got ${newSaldo}`);
        }

    } catch (error) {
        console.error("Verification failed with error:", error);
    } finally {
        // Restore fs methods
        fs.writeFileSync = originalWriteFileSync;
        fs.readFileSync = originalReadFileSync;
        fs.existsSync = originalExistsSync;
    }
}

verifyAggregation();
