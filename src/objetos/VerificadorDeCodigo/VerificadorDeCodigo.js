// DEPENDENCIAS

const fs = require("fs");
const path = require("path");

// VARIABLES

const RutaCodigo = path.join(__dirname, "./VerficaforDeCodigo.json")
let Contenido
let ErrorGeneral
let Respuesta
let CodigoGuardado

// FUNCIONES

// Funcion -> inicializar objeto
function IniciarObjetoVerificadorDeCodigo() {

    ErrorGeneral = false

    // Paso -> verificar que el archivo existe
    if (!fs.existsSync(RutaCodigo)) {
        console.log("/nVerificadorDeCodigo: el archivo VerficaforDeCodigo.json fue eliminado")
        ErrorGeneral = true
    }
    // Paso -> leer el archivo json
    else {
        try {
            // Paso -> abrir el archivo json
            Contenido = JSON.parse(fs.readFileSync(RutaCodigo, "utf8"))
            if (!Contenido) {
                console.log("/nVerificadorDeCodigo: el archivo VerficaforDeCodigo.json se encuentra completamente vacio")
                ErrorGeneral = true
            } else {
                // Paso -> asignar variables
                CodigoGuardado = Contenido.Codigo
                ErrorGeneral = false
            }
        } catch (error) {
            console.log("/nVerificadorDeCodigo: el archivo VerficaforDeCodigo.json no se pudo leer")
            ErrorGeneral = true
        }
    }

    return ({ "error": ErrorGeneral })
}

// Funcion -> comparar codigo
function CompararCodigo(Codigo) {

    ErrorGeneral = false

    // mensaje de flujo
    console.log("\nVerificadorDeCodigo: se comparara el codigo ingresado")

    // Paso -> iniciar el objeto
    Respuesta = IniciarObjetoVerificadorDeCodigo()
    if (Respuesta.error == true) {
        ErrorGeneral = true
        return ({ "error": ErrorGeneral, "resultado": false })
    } else {

        // Paso -> comparar el codigo
        let resultado = (Codigo === CodigoGuardado)

        // Informar resultado
        console.log("VerificadorDeCodigo: resultado de comparacion: ", resultado)

        return ({ "error": ErrorGeneral, "resultado": resultado })
    }
}

// EXPORTAR
module.exports = {
    CompararCodigo
}
