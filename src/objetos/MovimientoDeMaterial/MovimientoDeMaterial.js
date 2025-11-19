// DEPENDENCIAS

const fs = require("fs");
const path = require("path");

// VARIABLES

const RutaMovimientoDeMaterial = path.join(__dirname,"./MovimientoDeMaterial.json");
const Cliente = require(path.join(__dirname,"../Cliente/Cliente.js"));
const CapturaDeCuenta = require(path.join(__dirname,"../CapturaDeCuenta/CapturaDeCuenta.js"));
let ListaMovimientos = [];
let Contador = 0;
let Contenido;
let ErrorGeneral;
let Respuesta;

// FUNCIONES

// Funcion -> inicializar objeto
function IniciarObjetoMovimientoDeMaterial (){

    ErrorGeneral = false;

    // Paso -> verificar que el archivo existe
    if(!fs.existsSync(RutaMovimientoDeMaterial)){
        console.log("/nMovimientoDeMaterial: el archivo MovimientoDeMaterial.json fue eliminado");
        ErrorGeneral = true;
        return({"error":ErrorGeneral});
    }
    // Paso -> leer el archivo json
    else{
        try{
            // Paso -> abrir el archivo json
            Contenido = JSON.parse(fs.readFileSync(RutaMovimientoDeMaterial,"utf8"));
            if(!Contenido){
                console.log("/nMovimientoDeMaterial: el archivo MovimientoDeMaterial.json se encuentra completamente vacio");
            }else{
                // Paso -> asignar variables
                ListaMovimientos = Contenido.Elementos;
                Contador = Contenido.Contador;
                return({"error":ErrorGeneral});
            }
        }catch(error){
            console.log("/nMovimientoDeMaterial: el archivo MovimientoDeMaterial.json no se pudo leer");
            ErrorGeneral = true;
            return ({"error":ErrorGeneral});
        }
    }
}

// Funcion -> eliminar objeto
function CerrarObjetoMovimientoDeMaterial (){

    ErrorGeneral = false;

     // Paso -> guardar los datos actualizados en el archivo JSON
     try{
        // Paso -> actualizar los datos
        Contenido.Elementos = ListaMovimientos;
        Contenido.Contador = Contador;
        // Paso -> guardar el archivo
        fs.writeFileSync(RutaMovimientoDeMaterial, JSON.stringify(Contenido, null, 4), 'utf8');
        return({"error":ErrorGeneral});
     }catch(error){
        console.error("\nMovimientoDeMaterial: no se pudo escribir en el archivo MovimientoDeMaterial.json");
        ErrorGeneral = true;
        return({"error":ErrorGeneral});
     } 
}

// Funcion -> guardar un movimiento de material en una cuenta
function GuardarMovimientoMaterial (DetalleDeMovimiento){

    ErrorGeneral = false;
    let flujo = true;
    let res;

    console.log("\nMovimientoDeMaterial: se guardara este movimiento: ");
    console.log(DetalleDeMovimiento);

    console.log("MD: iniciando objeto");
    Respuesta = IniciarObjetoMovimientoDeMaterial();
    if(Respuesta.error == true){
        ErrorGeneral = true;
        return({"error":ErrorGeneral});
    }else{
        console.log("MD: se inició el objeto");
        switch(DetalleDeMovimiento.Tipo){
            case "Retiro":
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha);
                if(res.error == true){
                    flujo = false;
                }else{
                    res = Cliente.ModificarSaldoMaterial("Disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID);
                    if(res.error == true){
                        flujo = false;
                    }
                }
                break;
            case "Ingreso":
                res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha);
                if(res.error == true){
                    flujo = false;
                }else{
                    res = Cliente.ModificarSaldoMaterial("Aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID);
                    if(res.error == true){
                        flujo = false;
                    }
                }
                break;
            default:
                flujo = false;
        }

        if(flujo == true){
            Contador = Contador + 1;
            DetalleDeMovimiento.ID = Contador;

            // Paso -> hacer captura del saldo del cliente
            let Respuesta = Cliente.ObtenerSaldo(DetalleDeMovimiento.ClienteID,"material")
            if(Respuesta.error == false){
                DetalleDeMovimiento.CapturaSaldo = Respuesta.SaldoMaterial
            }else{
                DetalleDeMovimiento.CapturaSaldo = 0
            }

            ListaMovimientos.push(DetalleDeMovimiento);
            Respuesta = CerrarObjetoMovimientoDeMaterial();
            if(Respuesta.error == true){
                ErrorGeneral = true;
                return ({"error":ErrorGeneral});
            }
        }else{
            ErrorGeneral = true;
            return ({"error":ErrorGeneral});
        }
        return ({"error":ErrorGeneral});
    }
}

// Funcion -> obtener todos los movimientos de material
function ObtenerMovimientosMaterial (FechaInicial,FechaFinal){

    ErrorGeneral = false;
    Respuesta = IniciarObjetoMovimientoDeMaterial();
    if(Respuesta.error == true){
        ErrorGeneral = true;
        return({"error":ErrorGeneral});
    }

    let ListaFiltrada = ListaMovimientos.filter(Movimiento=>{
        let FechaMovimiento = new Date(Movimiento.Fecha);
        let FechaInicialValida = new Date(FechaInicial);
        let FechaFinalValida = new Date(FechaFinal);
        return FechaMovimiento >= FechaInicialValida && FechaMovimiento <= FechaFinalValida;
    });

    return ({"error":ErrorGeneral,"ListaMovimientosMateriales":ListaFiltrada});
}

    // Funcion -> eliminar un movimiento de material
    function EliminarMovimientoMaterial (IDMovimiento){

        ErrorGeneral = false
        let flujo = true
        let res

        // mensaje de flujo
        console.log("\nMovimientoDeMaterial: se eliminara este movimiento: ")
        console.log(IDMovimiento)

        // Paso -> iniciar el objeto
        console.log("MM: inciando objeto")
        Respuesta = IniciarObjetoMovimientoDeMaterial()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return({"error":ErrorGeneral})
        }else{

            // Paso -> encontrar los detalles del movimiento
            let DetalleDeMovimiento = ListaMovimientos.filter(Movimiento => Movimiento.ID == IDMovimiento)[0]
            console.log("MM: este es el detalle")
            console.log(DetalleDeMovimiento)
            // Paso -> modificar la cuenta empresarial y la cuenta personal
            switch(DetalleDeMovimiento.Tipo){
                case "Retiro":
                    console.log("MM: este es retiro")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        console.log("MM: no se pudo modificar cuenta empresarial")
                        flujo = false
                    }else{
                        console.log("MM: si se pudo modificar cuenta empresarial")
                        res = Cliente.ModificarSaldoMaterial("Aumentar",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            console.log("MM: no se pudo modificar cuenta personal")
                            flujo = false
                        }
                    }
                    break
                case "Ingreso":
                    console.log("MM: este es ingreso")
                    res = CapturaDeCuenta.ModificarCuentaEmpresarial("material","disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.Fecha)
                    if(res.error == true){
                        flujo = false
                    }else{
                        res = Cliente.ModificarSaldoMaterial("Disminuir",DetalleDeMovimiento.Importe,DetalleDeMovimiento.ClienteID)
                        if(res.error == true){
                            flujo = false
                        }
                    }
                    break
                default:
                    console.log("\nMovimientoDeMaterial: no existe esta operacion: ",DetalleDeMovimiento.Tipo)
                    flujo = false
            }

            // Ver si no ha sucedido ningun problema
            console.log("MM: este es el flujo: ",flujo)
            if(flujo == true){

                // Paso -> encontrar el indice
                let ListaFiltrada = ListaMovimientos.filter(Movimiento => Movimiento.ID !== IDMovimiento)

                // Paso -> eliminar de la lista
                console.log("MM: toda ha ido bien, ahora este es el detalle que se eliminara: ")
                console.log(DetalleDeMovimiento)

                ListaMovimientos = ListaFiltrada

                // Paso -> cerrar el componente para guardar cambios
                Respuesta = CerrarObjetoMovimientoDeMaterial()
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

module.exports = {
    GuardarMovimientoMaterial,
    ObtenerMovimientosMaterial,
    EliminarMovimientoMaterial
}