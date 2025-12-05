const fs = require('fs');
const path = require('path');

// Rutas a los archivos JSON
const rutaArchivoEconomico = path.join(__dirname, 'MovimientoEmpresarialEconómico.json');
const rutaArchivoMaterial = path.join(__dirname, 'MovimientoEmpresarialMaterial.json');

// Función -> Guardar un nuevo movimiento empresarial
function GuardarMovimiento(movimiento) {
    try {
        let rutaArchivo;

        // Determinar qué archivo usar según el tipo de movimiento
        if (movimiento.Tipo === "Capital") {
            rutaArchivo = rutaArchivoEconomico;
        } else if (movimiento.Tipo === "Material") {
            rutaArchivo = rutaArchivoMaterial;
        } else {
            throw new Error("Tipo de movimiento no válido: " + movimiento.Tipo);
        }

        // Leer el archivo JSON correspondiente
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

// Función -> Obtener todos los movimientos (combinados)
function ObtenerMovimientos() {
    try {
        let movimientosCombinados = [];

        // Leer movimientos económicos
        if (fs.existsSync(rutaArchivoEconomico)) {
            let dataEconomico = fs.readFileSync(rutaArchivoEconomico, 'utf8');
            let jsonEconomico = JSON.parse(dataEconomico);
            movimientosCombinados = movimientosCombinados.concat(jsonEconomico.Elementos);
        }

        // Leer movimientos materiales
        if (fs.existsSync(rutaArchivoMaterial)) {
            let dataMaterial = fs.readFileSync(rutaArchivoMaterial, 'utf8');
            let jsonMaterial = JSON.parse(dataMaterial);
            movimientosCombinados = movimientosCombinados.concat(jsonMaterial.Elementos);
        }

        // Ordenar por ID o Fecha si es necesario (opcional, pero recomendable si se muestran juntos)
        // Por ahora los devolvemos tal cual, o podríamos ordenarlos por ID global si fuera único, pero ahora son independientes.
        // El consumidor (main.js) podría esperar un orden.
        // Dado que los IDs pueden repetirse entre archivos (1 en eco, 1 en mat), el ordenamiento por ID podría ser confuso si se mezclan.
        // Mejor no ordenar aquí y dejar que el consumidor decida, o concatenar simplemente.

        return { error: false, Elementos: movimientosCombinados };
    } catch (error) {
        console.error("Error al obtener movimientos empresariales:", error);
        return { error: true, Elementos: [] };
    }
}

module.exports = { GuardarMovimiento, ObtenerMovimientos };
