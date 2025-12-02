const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON
const rutaArchivo = path.join(__dirname, 'MovimientoEmpresarial.json');

// Función -> Guardar un nuevo movimiento empresarial
function GuardarMovimiento(movimiento) {
    try {
        // Leer el archivo JSON
        let data = fs.readFileSync(rutaArchivo, 'utf8');
        let movimientos = JSON.parse(data);

        // Incrementar el contador
        movimientos.Contador += 1;

        // Asignar ID al movimiento
        movimiento.ID = movimientos.Contador;

        // Agregar el movimiento a la lista
        movimientos.Elementos.push(movimiento);

        // Guardar los cambios en el archivo
        fs.writeFileSync(rutaArchivo, JSON.stringify(movimientos, null, 4));

        return { error: false, mensaje: "Movimiento guardado correctamente", id: movimiento.ID };
    } catch (error) {
        console.error("Error al guardar movimiento empresarial:", error);
        return { error: true, mensaje: "Error al guardar el movimiento" };
    }
}

// Función -> Obtener todos los movimientos (opcional, para futuro uso)
function ObtenerMovimientos() {
    try {
        let data = fs.readFileSync(rutaArchivo, 'utf8');
        let movimientos = JSON.parse(data);
        return { error: false, Elementos: movimientos.Elementos };
    } catch (error) {
        console.error("Error al obtener movimientos empresariales:", error);
        return { error: true, Elementos: [] };
    }
}

module.exports = { GuardarMovimiento, ObtenerMovimientos };
