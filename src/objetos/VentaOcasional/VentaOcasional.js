// DEPENDENCIAS

    const fs = require("fs");
    const path = require("path");

// VARIABLES

    const RutaVentaOcasional = path.join(__dirname,"./VentaOcasional.json")
    const CapturaDeCuenta = require(path.join(__dirname,"../CapturaDeCuenta/CapturaDeCuenta.js"))
    let ListaVentaOcasional = []
    let Contador = 0
    let contenido
    let ErrorGeneral
    let Respuesta

// FUNCIONES

    // Funcion -> inicializar objeto
    function IniciarObjetoVentaOcasional (){

        ErrorGeneral = false

        // Paso -> verificar que el archivo existe
        if(!fs.existsSync(RutaVentaOcasional)){
            console.log("/nRutaVentaOcasional: el archivo RutaVentaOcasional.json fue eliminado")
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }
        // Paso -> leer el archivo json
        else{
            try{
                // Paso -> abrir el archivo json
                contenido = JSON.parse(fs.readFileSync(RutaVentaOcasional,"utf8"))
                if(!contenido){
                    console.log("/nVentaOcasional: el archivo VentaOcasional.json se encuentra completamente vacio")
                }else{
                    // Paso -> asignar variables
                    ListaVentaOcasional = contenido.Elementos
                    Contador = contenido.Contador
                    return({"error":ErrorGeneral})
                }
            }catch(error){
                console.log("/nVentaOcasional: el archivo VentaOcasional.json no se pudo leer")
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }
        }
    }

    // Funcion -> eliminar objeto
    function CerrarObjetoVentaOcasional (){
        ErrorGeneral = false
         // Paso -> guardar los datos actualizados en el archivo JSON
         try{
            // Paso -> actualizar los datos
            contenido.Elementos = ListaVentaOcasional
            contenido.Contador = Contador
            // Paso -> guardar el archivo
            fs.writeFileSync(RutaVentaOcasional,JSON.stringify(contenido, null, 4), 'utf8');
            return({"error":ErrorGeneral})
         }catch(error){
            console.error("\nVentaOcasional: no se pudo escribir en el archivo VentaOcasional.json");
            ErrorGeneral = true
            return({"error":ErrorGeneral})
         } 
    }

    // Funcion -> guardar una venta ocasional
    function GuardarVentaOcasional (DetalleVentaOcasional){

        ErrorGeneral = false
        let flujo = true
        let res

        // mensaje de flujo
        console.log("\nVentaOcasional: se guardara esta venta: ")
        console.log(DetalleVentaOcasional)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoVentaOcasional()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }

        if(ErrorGeneral == false){

            // Paso -> modificar la cuenta empresarial a traves de la captura de cuenta
            switch(DetalleVentaOcasional.Tipo){
                case "venta":
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","aumentar",DetalleVentaOcasional.MontoEconomico,DetalleVentaOcasional.Fecha)
                    if(res.error == true){
                        flujo = false
                    }
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","disminuir",DetalleVentaOcasional.MontoMaterial,DetalleVentaOcasional.Fecha)
                    if(res.error == true){
                        flujo = false
                    }
                    break
                case "compra":
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","disminuir",DetalleVentaOcasional.MontoEconomico,DetalleVentaOcasional.Fecha)
                    if(res.error == true){
                        flujo = false
                    }
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","aumentar",DetalleVentaOcasional.MontoMaterial,DetalleVentaOcasional.Fecha)
                    if(res.error == true){
                        flujo = false
                    }
                    break
                default:
                    console.log("\nVentaOcasional: no existe esta operacion: ",DetalleVentaOcasional.Tipo)
                    flujo = false
            }

            if(flujo == true){

                // Paso -> asignar ID
                Contador = Contador + 1
                DetalleVentaOcasional.ID = Contador

                // Paso -> guardar en la lista
                ListaVentaOcasional.push(DetalleVentaOcasional)

                // Paso -> cerrar el componente para guardar cambios
                Respuesta = CerrarObjetoVentaOcasional()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }

            }else{
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }

            return ({"error":ErrorGeneral})
        }

    }

    // Funcion -> obtener todas las ventas ocasionales
    function ObtenerListaVentaOcasional (FechaInicial,FechaFinal){

        ErrorGeneral = false

        // Paso -> cargar los datos
        Respuesta = IniciarObjetoVentaOcasional()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }

        // Paso -> filtrar las ventas ocasionales
        let ListaFiltrada = ListaVentaOcasional.filter(VentaOcasional=>{
            // convertir a formato
            let FechaVentaOcasional = new Date(VentaOcasional.Fecha)
            let FechaInicialValida = new Date(FechaInicial)
            let FechaFinalValida = new Date(FechaFinal)
            return FechaVentaOcasional>=FechaInicialValida && FechaVentaOcasional<=FechaFinalValida
        })

        // Paso -> retornar la lista completa
        return ({"error":ErrorGeneral,"ListaFiltrada":ListaFiltrada})
        
    }

    // Funcion -> eliminar una venta ocasional
    function EliminarVentaOcasional (DetalleVentaOcasional){

        ErrorGeneral = false
        let flujo = true
        let res

        // Paso -> cargar todos los datos
        Respuesta = IniciarObjetoVentaOcasional()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }

        // Paso -> modificar la cuenta empresarial a traves de la captura de cuenta
        switch(DetalleVentaOcasional.Tipo){
            case "venta":
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","disminuir",DetalleVentaOcasional.MontoEconomico,DetalleVentaOcasional.Fecha)
                console.log("reeeesssss: ", res)
                if(res.error == true){flujo = false}
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","aumentar",DetalleVentaOcasional.MontoMaterial,DetalleVentaOcasional.Fecha)
                if(res.error == true){flujo = false}
                break
            case "compra":
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","aumentar",DetalleVentaOcasional.MontoEconomico,DetalleVentaOcasional.Fecha)
                if(res.error == true){flujo = false}
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","disminuir",DetalleVentaOcasional.MontoMaterial,DetalleVentaOcasional.Fecha)
                if(res.error == true){flujo = false}
                break
            default:
                console.log("\nVentaOcasional: no existe esta operacion: ",DetalleVentaOcasional.Tipo)
        }

        if(flujo == true){
            // Paso -> buscar el elemmento
            let ListaFiltrada = ListaVentaOcasional.filter(VentaOcasional => VentaOcasional.ID !== DetalleVentaOcasional.ID)

            // Paso -> asignar la nuevva lista
            ListaVentaOcasional = ListaFiltrada

            // Paso -> cerrar el componente para guardar cambios
            Respuesta = CerrarObjetoVentaOcasional()
            if(Respuesta.error == true){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }   
        }else{
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }

        return({"error":ErrorGeneral})
    }

// EXPORTAR
module.exports = {
    GuardarVentaOcasional,
    ObtenerListaVentaOcasional,
    EliminarVentaOcasional
}