// DEPENDENCIAS

const fs = require("fs");
const path = require("path");

// VARIABLES

const RutaCuentaEmpresarial = path.join(__dirname, "./CuentaEmpresarial.json")
let CapitalEconomico = 0
let CapitalMaterial = 0
let contenido
let ErrorGeneral
let Respuesta

// FUNCIONES

// Funcion -> inicializar objeto
function IniciarObjetoCapitalEconomico() {

    ErrorGeneral = false

    // Paso -> verificar que el archivo existe
    if (!fs.existsSync(RutaCuentaEmpresarial)) {
        console.log("/nCuentaEmpresarial: el archivo CuentaEmpresarial.json fue eliminado")
        ErrorGeneral = true
    }
    // Paso -> leer el archivo json
    else {
        try {
            // Paso -> abrir el archivo json
            contenido = JSON.parse(fs.readFileSync(RutaCuentaEmpresarial, "utf8"))
            if (!contenido) {
                console.log("/nCuentaEmpresarial: el archivo CuentaEmpresarial.json se encuentra completamente vacio")
                ErrorGeneral = true
            } else {
                // Paso -> asignar variables
                CapitalEconomico = contenido.CapitalEconomico
                CapitalMaterial = contenido.CapitalMaterial
                ErrorGeneral = false
            }
        } catch (error) {
            console.log("/nCuentaEmpresarial: el archivo CuentaEmpresarial.json no se pudo leer")
            ErrorGeneral = true
        }
    }

    return ({ "error": ErrorGeneral })
}

// Funcion -> eliminar objeto
function CerrarObjetoCapitalEconomico() {
    ErrorGeneral = false
    // Paso -> guardar los datos actualizados en el archivo JSON
    try {
        // Paso -> actualizar los datos
        contenido.CapitalEconomico = CapitalEconomico
        contenido.CapitalMaterial = CapitalMaterial
        // Paso -> guardar el archivo
        fs.writeFileSync(RutaCuentaEmpresarial, JSON.stringify(contenido, null, 4), 'utf8');
        ErrorGeneral = false
    } catch (error) {
        console.error("\nCuentaEmpresarial: no se pudo escribir en el archivo CuentaEmpresarial.json");
        ErrorGeneral = true
    }
    return ({ "error": ErrorGeneral })
}

// Funcion -> Modificar el capital economico
function ModificarCapitalEconomico(operacion, monto) {

    ErrorGeneral = false

    // Paso 1 -> iniciar con el objeto
    Respuesta = IniciarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    // Paso 2 -> modificar segun la operacion
    if (ErrorGeneral == false) {
        switch (operacion) {
            case "aumentar":
                CapitalEconomico = (parseFloat(CapitalEconomico) + parseFloat(monto)).toFixed(2)
                break
            case "disminuir":
                CapitalEconomico = (parseFloat(CapitalEconomico) - parseFloat(monto)).toFixed(2)
                break
            default:
                console.log("CuentaEmpresarial: no se reconoce la operacion: ", operacion)
                ErrorGeneral = true
                return ({ "error": ErrorGeneral })
        }
    }

    // Paso -> finalizar con el objeto
    Respuesta = CerrarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    return ({ "error": ErrorGeneral })
}

// Funcion -> Modificar el capital economico
function ModificarCapitalMaterial(operacion, monto) {

    ErrorGeneral = false

    // Paso 1 -> iniciar con el objeto
    Respuesta = IniciarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    // Paso 2 -> modificar segun la operacion
    if (ErrorGeneral == false) {
        switch (operacion) {
            case "aumentar":
                CapitalMaterial = (parseFloat(CapitalMaterial) + parseFloat(monto)).toFixed(2)
                break
            case "disminuir":
                CapitalMaterial = (parseFloat(CapitalMaterial) - parseFloat(monto)).toFixed(2)
                break
            default:
                console.log("CuentaEmpresarial: no se reconoce la operacion: ", operacion)
                ErrorGeneral = true
                return ({ "error": ErrorGeneral })
        }
    }

    // Paso -> finalizar con el sobjeto
    Respuesta = CerrarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    return ({ "error": ErrorGeneral })

}

// Funcion -> Obtener capital economico actual
function ObtenerCapitalEconomicoActual() {

    ErrorGeneral = false

    // Paso -> iniciar con el objeto
    Respuesta = IniciarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    return { "error": ErrorGeneral, "CapitalEconomico": CapitalEconomico }
}

// Funcion -> Obtener capital material actual
function ObtenerCapitalMaterialActual() {

    ErrorGeneral = false

    // Paso -> iniciar con el objeto
    Respuesta = IniciarObjetoCapitalEconomico()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral })
    }

    return { "error": ErrorGeneral, "CapitalMaterial": CapitalMaterial }
}

// EXPORTAR
module.exports = {
    ModificarCapitalEconomico,
    ModificarCapitalMaterial,
    ObtenerCapitalEconomicoActual,
    ObtenerCapitalMaterialActual
}