// DEPENDENCIAS

    const fs = require("fs");
    const path = require("path");

// VARIABLES

    const RutaClientes = path.join(__dirname,"./Cliente.json")
    let Contenido
    let ErrorGeneral
    let Respuesta
    let ListaClientes
    let Contador

// FUNCIONES

    // Funcion -> inicializar objeto
    function IniciarObjetoCliente (){

        ErrorGeneral = false

        // Paso -> verificar que el archivo existe
        if(!fs.existsSync(RutaClientes)){
            console.log("/nCliente: el archivo Cliente.json fue eliminado")
            ErrorGeneral = true
        }
        // Paso -> leer el archivo json
        else{
            try{
                // Paso -> abrir el archivo json
                Contenido = JSON.parse(fs.readFileSync(RutaClientes,"utf8"))
                if(!Contenido){
                    console.log("/nCliente: el archivo Cliente.json se encuentra completamente vacio")
                    ErrorGeneral = true
                }else{
                    // Paso -> asignar variables
                    Contador = Contenido.Contador
                    ListaClientes = Contenido.Elementos
                    ErrorGeneral = false
                }
            }catch(error){
                console.log("/nCliente: el archivo Cliente.json no se pudo leer")
                ErrorGeneral = true
            }
        }

        return ({"error":ErrorGeneral})
    }

    // Funcion -> eliminar objeto
    function CerrarObjetoCliente (){

        ErrorGeneral = false

        // Paso -> guardar los datos actualizados en el archivo JSON
        try{
            // Paso -> actualizar los datos
            Contenido.Contador = Contador
            Contenido.Elementos = ListaClientes
            // Paso -> guardar el archivo
            fs.writeFileSync(RutaClientes,JSON.stringify(Contenido, null, 4), 'utf8');
            ErrorGeneral = false
        }catch(error){
            console.error("\nCliente: no se pudo escribir en el archivo Cliente.json");
            ErrorGeneral = true
        }

        return ({"error":ErrorGeneral})
    }

    // Funcion -> guardar nuvo cliente
    function GuardarCliente (DetalleCliente){

        ErrorGeneral = false

        // mensjae de flujo
        console.log("\nCliente: se guardara a este cliente")
        console.log(DetalleCliente)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> asignar id
            DetalleCliente.ID = Contador + 1
            Contador = Contador + 1

            // Paso -> incluir en la lista
            ListaClientes.push(DetalleCliente)


            // Paso -> guardar los datos con el cierre
            Respuesta = CerrarObjetoCliente()
            if(Respuesta.error == true){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }

        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    function EditarCliente (DetalleCliente){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nCliente: se editara el siguiente cliente con estos datos: ")
        console.log(DetalleCliente)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> buscar el indice del cliente con el ID
            let IndiceCliente = ListaClientes.findIndex(Cliente => Cliente.ID == DetalleCliente.ID)
            if(IndiceCliente === -1){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{

                // Paso -> actualizar datos en la lista
                ListaClientes[IndiceCliente] = {
                    ...ListaClientes[IndiceCliente], // para mantener los valores originales
                    ...DetalleCliente, // para sobrescribir con los nuevos datos
                    ID: ListaClientes[IndiceCliente].ID
                }

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoCliente()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    function EliminarCliente (IDCliente){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nCliente: se eliminar el cliente con ID: ")
        console.log(IDCliente)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> buscar el indice del cliente con el ID
            let IndiceCliente = ListaClientes.findIndex(Cliente => Cliente.ID == IDCliente)
            if(IndiceCliente === -1){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{

                // Paso -> eliminar al cliente
                ListaClientes.splice(IndiceCliente,1)

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoCliente()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    function ModificarSaldoEconomico (Operacion,Monto,IDCliente){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nCliente: se codificara el saldo economico de: ")
        console.log("Cliente: monto: ",Monto)
        console.log("Cliente: DICliente: ",IDCliente)

        // Paso -> iniciar el objeto
        console.log("Cliente: iniciar objeto")
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            console.log("Cliente: error al inciar objeto")
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{
            console.log("Cliente: si se inicio")

            // Paso -> obtener todos los datos del cliente
            let DetalleCliente
            let ListaTemporalCliente = ListaClientes.filter(cliente=>cliente.ID == IDCliente)
            if(ListaTemporalCliente.length > 0){
                DetalleCliente = ListaTemporalCliente[0]
            }else{
                console.log("Cliente: error no se encontro clientes en la lista temporarl")
                ErrorGeneral = true
                DetalleCliente = {}
                return ({"error":ErrorGeneral})
            }

            // Paso -> conocer el tipo de operacion y su monto final
            let SaldoFinal = 0
            switch(Operacion){
                case "Aumentar":
                    console.log("Cliente: operacion aumentar")
                    SaldoFinal = DetalleCliente.SaldoEconomico + Monto
                    break
                case "Disminuir":
                    console.log("Cliente: operacion desminuir")
                    SaldoFinal = DetalleCliente.SaldoEconomico - Monto
                    break
                default:
                    console.log("Cliente: no existe esta operacion: ",Operacion)
                    ErrorGeneral = true
                    return({"error":ErrorGeneral})
            }

            console.log("Cliente: saldo final: ",SaldoFinal)

            // Paso -> buscar el indice del cliente con el ID
            let IndiceCliente = ListaClientes.findIndex(Cliente => Cliente.ID == IDCliente)
            if(IndiceCliente === -1){
                console.log("Cliente: no se encontro al cliente")
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{
                console.log("Cliente: si se encontro el cliente")
                // Paso -> actualizar datos en la lista
                ListaClientes[IndiceCliente] = {
                    ...ListaClientes[IndiceCliente], // para mantener los valores originales
                    SaldoEconomico: SaldoFinal
                }

                console.log("Cliente: lista de clientes: ",ListaClientes)

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoCliente()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})
    }

    function ModificarSaldoMaterial (Operacion,Monto,IDCliente){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nCliente: se codificara el saldo economico de: ")
        console.log("Cliente: monto: ",Monto)
        console.log("Cliente: DICliente: ",IDCliente)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> obtener todos los datos del cliente
            let DetalleCliente
            let ListaTemporalCliente = ListaClientes.filter(cliente=>cliente.ID == IDCliente)
            if(ListaTemporalCliente.length > 0){
                DetalleCliente = ListaTemporalCliente[0]
            }else{
                console.log("Cliente: error no se encontro clientes en la lista temporarl")
                ErrorGeneral = true
                DetalleCliente = {}
                return ({"error":ErrorGeneral})
            }

            // Paso -> conocer el tipo de operacion y su monto final
            let SaldoFinal = 0
            switch(Operacion){
                case "Aumentar":
                    SaldoFinal = DetalleCliente.SaldoMaterial + Monto
                    break
                case "Disminuir":
                    SaldoFinal = DetalleCliente.SaldoMaterial - Monto
                    break
                default:
                    ErrorGeneral = true
                    return({"error":ErrorGeneral})
            }

            // Paso -> buscar el indice del cliente con el ID
            let IndiceCliente = ListaClientes.findIndex(Cliente => Cliente.ID == DetalleCliente.ID)
            if(IndiceCliente === -1){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{

                // Paso -> actualizar datos en la lista
                ListaClientes[IndiceCliente] = {
                    ...ListaClientes[IndiceCliente], // para mantener los valores originales
                    SaldoMaterial: SaldoFinal
                }

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoCliente()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})
    }

    function ObtenerListaClientes (){

        ErrorGeneral = false

        // Paso -> inciar para obtener variables y eso
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }
        
        return ({"error":ErrorGeneral,"ListaDeClientes":ListaClientes})

    }

    function ObtenerSaldo (IDCliente,TipoSaldo){

        ErrorGeneral = false

        // Paso -> iniciar para obtener variables
        Respuesta = IniciarObjetoCliente()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{
            // Paso -> buscar al cliente
            let DetalleCliente = ListaClientes.filter(Cliente => Cliente.ID == IDCliente)[0]
            if(TipoSaldo == "economico"){
                return ({"error":ErrorGeneral,"SaldoEconomico":DetalleCliente.SaldoEconomico})
            }else{
                return ({"error":ErrorGeneral,"SaldoMaterial":DetalleCliente.SaldoMaterial})
            }
        }
    }

// EXPORTAR
module.exports = {
    GuardarCliente,
    EditarCliente,
    EliminarCliente,
    ModificarSaldoEconomico,
    ModificarSaldoMaterial,
    ObtenerListaClientes,
    ObtenerSaldo
}