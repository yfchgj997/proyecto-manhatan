const { app, BrowserWindow, ipcMain } = require("electron");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const MovimientoEmpresarial = require('./src/objetos/MovimientoEmpresarial/MovimientoEmpresarial.js');

// Mock MovimientoEmpresarial.ObtenerMovimientos
MovimientoEmpresarial.ObtenerMovimientos = () => {
    return {
        error: false,
        Elementos: [
            {
                Tipo: "Capital",
                Operacion: "Aumentar",
                Fecha: "2025-12-04",
                Usuario: "Admin",
                Importe: "100.00",
                Detalle: "Test Capital",
                Hora: "10:00:00",
                CapturaSaldo: "1000.00",
                ID: 1
            },
            {
                Tipo: "Material",
                Operacion: "Disminuir",
                Fecha: "2025-12-04",
                Usuario: "Admin",
                Importe: "50.00",
                Detalle: "Test Material",
                Hora: "11:00:00",
                CapturaSaldo: "500.00",
                ID: 2
            }
        ]
    };
};

async function verifyExport() {
    console.log("Iniciando verificación de exportación Excel...");

    // Simulate the export logic from main.js
    let respuesta = MovimientoEmpresarial.ObtenerMovimientos();
    let movimientos = respuesta.Elementos;

    // Sort
    movimientos.sort((a, b) => {
        let fechaA = new Date(`${a.Fecha}T${a.Hora}`);
        let fechaB = new Date(`${b.Fecha}T${b.Hora}`);
        return fechaA - fechaB;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos');

    worksheet.columns = [
        { header: 'Fecha', key: 'Fecha', width: 15 },
        { header: 'Hora', key: 'Hora', width: 15 },
        { header: 'Usuario', key: 'Usuario', width: 20 },
        { header: 'Detalle', key: 'Detalle', width: 40 },
        { header: 'I.DINERO', key: 'IDinero', width: 15 },
        { header: 'E.DINERO', key: 'EDinero', width: 15 },
        { header: 'S.DINERO', key: 'SDinero', width: 15 },
        { header: 'I.MATERIAL', key: 'IMaterial', width: 15 },
        { header: 'E.MATERIAL', key: 'EMaterial', width: 15 },
        { header: 'S.MATERIAL', key: 'SMaterial', width: 15 }
    ];

    movimientos.forEach(mov => {
        let row = {
            Fecha: mov.Fecha,
            Hora: mov.Hora,
            Usuario: mov.Usuario,
            Detalle: mov.Detalle,
            IDinero: '',
            EDinero: '',
            SDinero: '',
            IMaterial: '',
            EMaterial: '',
            SMaterial: ''
        };

        if (mov.Tipo === "Capital") {
            if (mov.Operacion === "Aumentar") {
                row.IDinero = parseFloat(mov.Importe);
            } else if (mov.Operacion === "Disminuir") {
                row.SDinero = parseFloat(mov.Importe);
            }
            row.EDinero = parseFloat(mov.CapturaSaldo);
        } else if (mov.Tipo === "Material") {
            if (mov.Operacion === "Aumentar") {
                row.IMaterial = parseFloat(mov.Importe);
            } else if (mov.Operacion === "Disminuir") {
                row.SMaterial = parseFloat(mov.Importe);
            }
            row.EMaterial = parseFloat(mov.CapturaSaldo);
        }

        worksheet.addRow(row);
    });

    const filePath = path.join(__dirname, 'verify_export.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`✅ Archivo Excel creado en: ${filePath}`);

    // Verify file exists
    if (fs.existsSync(filePath)) {
        console.log("✅ Verificación exitosa: El archivo existe.");
        // Clean up
        fs.unlinkSync(filePath);
        console.log("✅ Archivo de prueba eliminado.");
    } else {
        console.error("❌ Verificación fallida: El archivo no se creó.");
    }
}

verifyExport();
