// DEPENDENCIAS

    const fs = require("fs");
    const path = require("path");

// VARIABLES

    const RutaCapturaDeCuenta = path.join(__dirname,"./CapturaDeCuenta.json")
    const CuentaEmpresarial = require(path.join(__dirname,"../CuentaEmpresarial/CuentaEmpresarial.js"))

    let ListaDeCapturas = []
    let Contenido
    let Respuesta
    let ErrorGeneral

// FUNCIONES

    // Funcion -> inicializar objeto
    function IniciarObjetoCapturaDeCuenta (){

        ErrorGeneral = false 

        // Paso -> verificar que el archivo existe
        if(!fs.existsSync(RutaCapturaDeCuenta)){
            console.log("/nCapturaDeCuenta: el archivo CapturaDeCuenta.json fue eliminado")
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }
        // Paso -> leer el archivo json
        else{
            try{
                // Paso -> abrir el archivo json
                let Contenido = JSON.parse(fs.readFileSync(RutaCapturaDeCuenta,"utf8"))
                if(!Contenido){
                    console.log("/nCapturaDeCuenta: el archivo CapturaDeCuenta.json se encuentra completamente vacio")
                }else{
                    // Paso -> asignar variables
                    ListaDeCapturas = Contenido
                    return({"error":ErrorGeneral})
                }
            }catch(error){
                console.log("/nCapturaDeCuenta: el archivo CapturaDeCuenta.json no se pudo leer")
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }
        }
    }
    
    // Funcion -> eliminar objeto
    function CerrarObjetoCapturaDeCuenta (){
        ErrorGeneral = false
        // Paso -> guardar los datos actualizados en el archivo JSON
        try{
            // Paso -> actualizar lista
            Contenido = ListaDeCapturas
            // Paso -> escribir en el archivo
            fs.writeFileSync(RutaCapturaDeCuenta,JSON.stringify(Contenido, null, 4), 'utf8');
            return ({"error":ErrorGeneral})
        }catch(error){
            console.error("\nCapturaDeCuenta: no se pudo escribir en el archivo CapturaDeCuenta.json");
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        } 
    }

    // Funcion -> guardar nueva captura 
    function GenerarCapturaDeCuentaEmpresarial (fecha){

        ErrorGeneral = false 

        // Paso -> inciar a obtener variables y eso
        Respuesta = IniciarObjetoCapturaDeCuenta()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }

        // Paso -> obtener los montos actuales
        let CapitalEconomicoActual = CuentaEmpresarial.ObtenerCapitalEconomicoActual()
        let CapitalMaterialActual = CuentaEmpresarial.ObtenerCapitalMaterialActual()

        // Paso -> generar nuevo objeto
        let NuevaCapturaDeCuenta = {
            "Fecha":fecha,
            "CapitalEconomicoInicial":CapitalEconomicoActual.CapitalEconomico,
            "CapitalMaterialInicial":CapitalMaterialActual.CapitalMaterial
        }

        // Paso -> insertar nuevo objeto en la lista
        ListaDeCapturas.push(NuevaCapturaDeCuenta)

        // Paso -> guardar modificaciones
        Respuesta = CerrarObjetoCapturaDeCuenta()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{
            return ({"error":ErrorGeneral})
        }
    }

    function BuscarCapturaDeCuentaEmpresarial (fecha){

        ErrorGeneral = false

        // var de retorno
        let existe = false

        // Paso -> inciar a obtener variables y eso
        Respuesta = IniciarObjetoCapturaDeCuenta()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }

        // Paso -> buscar en la lissta el elemento con la fecha
        let ListaFiltrada = ListaDeCapturas.filter(Captura=>{
            // convertir a formato
            let FechaCapturaValida = new Date(Captura.Fecha)
            let FechaValida = new Date(fecha)
            return FechaCapturaValida.getTime() === FechaValida.getTime();
        })
        console.log("CapturaDeCuenta: --------------------------------")
        console.log(ListaFiltrada)
        if(ListaFiltrada.length>=1){existe=true}

        // Paso -> retornar valor
        return ({"error":ErrorGeneral,"existe":existe})
    }

    // Funcion -> Obtener la tabla
    function ObtenerListaDeCapturas (){

        ErrorGeneral = false

        // Paso -> inciar a obtener variables y eso
        Respuesta = IniciarObjetoCapturaDeCuenta()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }
        
        return ({"error":ErrorGeneral,"ListaDeCapturas":ListaDeCapturas})
    }

    // Funcion -> modificar la cuenta empresarial
    function ModificarCuentaEmpresarial (capital,operacion,monto,fecha){

        ErrorGeneral = false 

        // Paso -> inciar a obtener variables y eso
        Respuesta = IniciarObjetoCapturaDeCuenta()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }

        // Paso -> asegurarse que la fecha no es de fechas anteriores
        let ListaFechasMayores = ListaDeCapturas.filter(Captura=>{
            let FechaCapturaValida = new Date(Captura.Fecha)
            let FechaValida = new Date(fecha)
            return FechaCapturaValida.getTime() > FechaValida.getTime();
        })
        if(!ListaFechasMayores.length>0){// significa que el registro no trata de insertar de una fecha anterior
            // Paso -> asegurarse de que se ha tomado captura del dia
            let ExisteCaptura = BuscarCapturaDeCuentaEmpresarial(fecha)
            console.log("CapturaDeCuenta: existe?")
            console.log(ExisteCaptura)
            if(!ExisteCaptura.existe){
                // Paso -> hacer una captura
                let res = GenerarCapturaDeCuentaEmpresarial(fecha)
                console.log("CapturaDeCuenta: este es el res de generar captura de cuenta")
                console.log(res)
            }

            // Paso -> ver que capital se va a modificar
            switch(capital){
                case "economico":
                    CuentaEmpresarial.ModificarCapitalEconomico(operacion,monto)
                    return ({"error":ErrorGeneral})
                case "material":
                    CuentaEmpresarial.ModificarCapitalMaterial(operacion,monto)
                    return ({"error":ErrorGeneral})
                default:
                    console.log("\nCapturaDeCuenta: no existe un capital llamado: ",capital)
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
            }
        }else{
            console.log("\nCapturaDeCuenta: lo sentimos, no se puede modificar la cuenta por que no pertenece a la ultima fecha")
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }
    }


// EXPORTAR
module.exports = {
    GenerarCapturaDeCuentaEmpresarial,
    BuscarCapturaDeCuentaEmpresarial,
    ObtenerListaDeCapturas,
    ModificarCuentaEmpresarial
}