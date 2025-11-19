// DEPENDENCIAS

    const fs = require("fs");
    const path = require("path");

// VARIABLES

    const RutaMovimientoDeDinero = path.join(__dirname,"./MovimientoDeDinero.json")
    const Cliente = require(path.join(__dirname,"../Cliente/Cliente.js"))
    const CapturaDeCuenta = require(path.join(__dirname,"../CapturaDeCuenta/CapturaDeCuenta.js"))
    let ListaMovimientos = []
    let Contador = 0
    let Contenido
    let ErrorGeneral
    let Respuesta

// FUNCIONES

    // Funcion -> inicializar objeto
    function IniciarObjetoMovimientoDeDinero (){

        ErrorGeneral = false

        // Paso -> verificar que el archivo existe
        if(!fs.existsSync(RutaMovimientoDeDinero)){
            console.log("/nMovimientoDeDinero: el archivo MovimientoDeDinero.json fue eliminado")
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }
        // Paso -> leer el archivo json
        else{
            try{
                // Paso -> abrir el archivo json
                Contenido = JSON.parse(fs.readFileSync(RutaMovimientoDeDinero,"utf8"))
                if(!Contenido){
                    console.log("/nMovimientoDeDinero: el archivo MovimientoDeDinero.json se encuentra completamente vacio")
                }else{
                    // Paso -> asignar variables
                    ListaMovimientos = Contenido.Elementos
                    Contador = Contenido.Contador
                    return({"error":ErrorGeneral})
                }
            }catch(error){
                console.log("/nMovimientoDeDinero: el archivo MovimientoDeDinero.json no se pudo leer")
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }
        }
    }

    // Funcion -> eliminar objeto
    function CerrarObjetoMovimientoDeDinero (){

        ErrorGeneral = false

         // Paso -> guardar los datos actualizados en el archivo JSON
         try{
            // Paso -> actualizar los datos
            Contenido.Elementos = ListaMovimientos
            Contenido.Contador = Contador
            // Paso -> guardar el archivo
            fs.writeFileSync(RutaMovimientoDeDinero,JSON.stringify(Contenido, null, 4), 'utf8');
            return({"error":ErrorGeneral})
         }catch(error){
            console.error("\nMovimientoDeDinero: no se pudo escribir en el archivo MovimientoDeDinero.json");
            ErrorGeneral = true
            return({"error":ErrorGeneral})
         } 
    }

    // Funcion -> guardar un movimiento de dinero en una cuenta
    function GuardarMovimientoEconomico (DetalleDeMovimiento){

        ErrorGeneral = false
        let flujo = true
        let res

        // mensaje de flujo
        console.log("\nMovimientoDeDinero: se guardara este movimiento: ")
        console.log(DetalleDeMovimiento)

        // Paso -> iniciar el objeto
        console.log("MD: inciando objeto")
        Respuesta = IniciarObjetoMovimientoDeDinero()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }else{
            console.log("MD: se inicio el objeto")
            // Paso -> modificar la cuenta empresarial y la cuenta personal
            switch(DetalleDeMovimiento.Tipo){
                case "Retiro":
                    console.log("MD: este es retiro")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        console.log("MD: no se pudo modificar cuenta empresarial")
                        flujo = false
                    }else{
                        console.log("MD: si se pudo modificar cuenta empresarial")
                        res = Cliente.ModificarSaldoEconomico("Disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            console.log("MD: no se pudo modificar cuenta personal")
                            flujo = false
                        }
                    }
                    break
                case "Ingreso":
                    console.log("MD: este es ingreso")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        flujo = false
                    }else{
                        res = Cliente.ModificarSaldoEconomico("Aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            flujo = false
                        }
                    }
                    break
                default:
                    console.log("\nMovimientoDeDinero: no existe esta operacion: ",DetalleDeMovimiento.Tipo)
                    flujo = false
            }

            // Ver si no ha sucedido ningun problema
            console.log("MD: este es el flujo: ",flujo)
            if(flujo == true){

                // Paso -> asignar ID
                Contador = Contador + 1
                DetalleDeMovimiento.ID = Contador

                // Paso -> hacer captura del saldo del cliente
                let Respuesta = Cliente.ObtenerSaldo(DetalleDeMovimiento.ClienteID,"economico")
                if(Respuesta.error == false){
                    DetalleDeMovimiento.CapturaSaldo = Respuesta.SaldoEconomico
                }else{
                    DetalleDeMovimiento.CapturaSaldo = 0
                }

                // Paso -> guardar en la lista
                console.log("MD: toda ha ido bien, ahora este es el detalle que se subira: ")
                console.log(DetalleDeMovimiento)
                ListaMovimientos.push(DetalleDeMovimiento)

                // Paso -> cerrar el componente para guardar cambios
                Respuesta = CerrarObjetoMovimientoDeDinero()
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

    // Funcion -> obtener todos los movimientos economicos
    function ObtenerMovimientosEconomicos (FechaInicial,FechaFinal){

        ErrorGeneral = false

        // Paso -> cargar los datos
        Respuesta = IniciarObjetoMovimientoDeDinero()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }

        // Paso -> filtrar los movimientos
        let ListaFiltrada = ListaMovimientos.filter(Movimiento=>{
            console.log("MD: ",Movimiento)
            // convertir a formato
            let FechaVentaOcasional = new Date(Movimiento.Fecha)
            let FechaInicialValida = new Date(FechaInicial)
            let FechaFinalValida = new Date(FechaFinal)
            console.log("MD: fechas")
            console.log("MD: ",FechaVentaOcasional)
            console.log("MD: ",FechaInicialValida)
            console.log("MD: ",FechaFinalValida)
            return FechaVentaOcasional>=FechaInicialValida && FechaVentaOcasional<=FechaFinalValida
        })

        console.log("MD: estos son los movimientos")
        console.log(ListaFiltrada)

        // Paso -> retornar la lista completa
        return ({"error":ErrorGeneral,"ListaMovimientosEconomicos":ListaFiltrada})
    }

    // Funcion -> eliminar un movimiento de dinero
    function EliminarMovimientoEconomico (IDMovimiento){

        ErrorGeneral = false
        let flujo = true
        let res

        // mensaje de flujo
        console.log("\nMovimientoDeDinero: se eliminara este movimiento: ")
        console.log(IDMovimiento)

        // Paso -> iniciar el objeto
        console.log("MD: inciando objeto")
        Respuesta = IniciarObjetoMovimientoDeDinero()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }else{

            // Paso -> encontrar los detalles del movimiento
            let DetalleDeMovimiento = ListaMovimientos.filter(Movimiento => Movimiento.ID == IDMovimiento)[0]
            console.log("MD: este es el detalle")
            console.log(DetalleDeMovimiento)
            // Paso -> modificar la cuenta empresarial y la cuenta personal
            switch(DetalleDeMovimiento.Tipo){
                case "Retiro":
                    console.log("MD: este es retiro")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        console.log("MD: no se pudo modificar cuenta empresarial")
                        flujo = false
                    }else{
                        console.log("MD: si se pudo modificar cuenta empresarial")
                        res = Cliente.ModificarSaldoEconomico("Aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            console.log("MD: no se pudo modificar cuenta personal")
                            flujo = false
                        }
                    }
                    break
                case "Ingreso":
                    console.log("MD: este es ingreso")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("economico","disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        flujo = false
                    }else{
                        res = Cliente.ModificarSaldoEconomico("Disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            flujo = false
                        }
                    }
                    break
                default:
                    console.log("\nMovimientoDeDinero: no existe esta operacion: ",DetalleDeMovimiento.Tipo)
                    flujo = false
            }

            // Ver si no ha sucedido ningun problema
            console.log("MD: este es el flujo: ",flujo)
            if(flujo == true){

                // Paso -> encontrar el indice
                let ListaFiltrada = ListaMovimientos.filter(Movimiento => Movimiento.ID !== IDMovimiento)

                // Paso -> eliminar de la lista
                console.log("MD: toda ha ido bien, ahora este es el detalle que se eliminara: ")
                console.log(DetalleDeMovimiento)

                ListaMovimientos = ListaFiltrada

                // Paso -> cerrar el componente para guardar cambios
                Respuesta = CerrarObjetoMovimientoDeDinero()
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

// EXPORTAR
module.exports = {
    GuardarMovimientoEconomico,
    ObtenerMovimientosEconomicos,
    EliminarMovimientoEconomico
}