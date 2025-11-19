const { REFUSED } = require("dns");
const fs = require("fs");
const path = require("path");

const rutaUsuarios = path.join(__dirname, "./datos/usuarios.json");

// OBJETOS

    const VentaOcasional = require(path.join(__dirname,"../objetos/VentaOcasional/VentaOcasional.js"))
    const MovimientoDeDinero = require(path.join(__dirname,"../objetos/MovimientoDeDinero/MovimientoDeDinero.js"))
    const MovimientoMaterial = require(path.join(__dirname,"../objetos/MovimientoDeMaterial/MovimientoDeMaterial.js"))
    const Cliente = require(path.join(__dirname,"../objetos/Cliente/Cliente.js"))
    const CuentaEmpresarial = require(path.join(__dirname,"../objetos/CuentaEmpresarial/CuentaEmpresarial.js"))
    const CapturaCuenta = require(path.join(__dirname,"../objetos/CapturaDeCuenta/CapturaDeCuenta.js"))

// Función para guardar clientes en un archivo JSON con asignación automática de ID
function GuardarUsuarioRespaldo(usuario) {
    let usuarios = [];
    let nuevoID = 1; // Si no hay clientes, el primer ID será 1
    let ErrorGen = ``

    // Verificar si el archivo existe; si no, crearlo vacío
    if (!fs.existsSync(rutaUsuarios)) {
        console.warn(`El archivo ${rutaUsuarios} no existe. Se creará uno nuevo.`);
        fs.writeFileSync(rutaUsuarios, JSON.stringify([]), "utf8");
    }

    // Verificar si el archivo existe
    if (fs.existsSync(rutaUsuarios)) {
        try {
            const contenido = fs.readFileSync(rutaUsuarios, "utf8").trim();

            if (contenido) {
                usuarios = JSON.parse(contenido);

                if (!Array.isArray(usuarios)) {
                    usuarios = [];
                }
                
                // Obtener el último ID registrado
                if (usuarios.length > 0) {
                    const ultimoID = usuarios[usuarios.length - 1].ID || 0; // Si no tiene ID, asumir 0
                    nuevoID = ultimoID + 1; // Sumar 1 al último ID
                }
            }
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
            usuarios = [];
            ErrorGen = error
        }
    }

    // Asignar el nuevo ID al cliente
    usuario.ID = nuevoID;
    
    // Agregar el nuevo cliente al array
    usuarios.push(usuario);

    // Guardar el array actualizado en el archivo JSON
    try {
        fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 4), "utf8");
        console.log(`MENSAJE: usuario guardado correctamente con ID ${nuevoID}`);
        return {"error":null,"estado":true};
    } catch (error) {
        console.error("Error: Ocurrió un error al escribir en el archivo JSON:", error);
        return {"error":error,"estado":false};
    }
}

function ObtenerTablaUsuarios (){

    let usuarios = [];

    // Verificar si el archivo existe
    if (fs.existsSync(rutaUsuarios)) {
        try {
            const contenido = fs.readFileSync(rutaUsuarios, "utf8").trim();
            
            if (contenido) {
                usuarios = JSON.parse(contenido);
                
                if (!Array.isArray(usuarios)) {
                    usuarios = [];
                }
            }
        } catch (error) {
            console.error("ERROR: error al leer el archivo JSON:", error);
            usuarios = [];
        }
    } else {
        console.log("MENSAJE: el archivo no existe, creando uno nuevo...");
        fs.writeFileSync(rutaUsuarios, JSON.stringify([], null, 4), "utf8");
    }

    return usuarios;

}

function EliminarUsuario(usuarioID) {
    let usuarios = [];

    // Verificar si el archivo existe
    if (fs.existsSync(rutaUsuarios)) {
        try {
            const contenido = fs.readFileSync(rutaUsuarios, "utf8").trim();

            if (contenido) {
                usuarios = JSON.parse(contenido);

                if (!Array.isArray(usuarios)) {
                    usuarios = [];
                }
            }
        } catch (error) {
            console.error("ERROR: al leer el archivo JSON:", error);
            return false;
        }
    } else {
        console.log("MENSAJE: No hay usuarios registrados.");
        return false;
    }

    // Buscar el cliente por ID
    const indiceUsuario = usuarios.findIndex(usuario => usuario.ID === usuarioID);

    if (indiceUsuario === -1) {
        console.log(`MENSAJE: No se encontró un usuario con ID ${usuarioID}.`);
        return false;
    }

    // Eliminar cliente del array
    usuarios.splice(indiceUsuario, 1);

    // Guardar el nuevo array sin el usuario eliminado
    try {
        fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 4), "utf8");
        console.log(`MENSAJE: Usuario con ID ${usuarioID} eliminado correctamente.`);
        return true;
    } catch (error) {
        console.error("ERROR: al escribir en el archivo JSON:", error);
        return false;
    }
}

function EditarUsuario(usuarioActualizado) {
    let usuarios = [];

    // Verificar si el archivo existe
    if (fs.existsSync(rutaUsuarios)) {
        try {
            const contenido = fs.readFileSync(rutaUsuarios, "utf8").trim();
            if (contenido) {
                usuarios = JSON.parse(contenido);
                if (!Array.isArray(usuarios)) {
                    usuarios = [];
                }
            }
        } catch (error) {
            console.error("ERROR: al leer el archivo JSON:", error);
            return false;
        }
    } else {
        console.log("MENSAJE: No hay usuairos registrados.");
        return false;
    }

    // Buscar el índice del usuario con el ID proporcionado
    const indiceUsuario = usuarios.findIndex(usuario => usuario.ID == usuarioActualizado.ID);

    if (indiceUsuario === -1) {
        console.log(`MENSAJE: No se encontró un usuairo con ID ${usuarioActualizado.ID}.`);
        return false;
    }

    // Mantener el ID y actualizar los demás datos
    usuarios[indiceUsuario] = {
        ...usuarios[indiceUsuario],  // Mantiene los valores originales
        ...usuarioActualizado,      // Sobrescribe con los nuevos datos
        ID: usuarios[indiceUsuario].ID  // Asegura que el ID no cambie
    };

    // Guardar la lista actualizada en el archivo JSON
    try {
        fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 4), "utf8");
        console.log(`MENSAJE: Usuario con ID ${usuarioActualizado.ID} editado correctamente.`);
        return true;
    } catch (error) {
        console.error("ERROR: al escribir en el archivo JSON:", error);
        return false;
    }
}

// -------------------------------------- GESTION DE CLIENTES ------------------------------------------------

    // Funcion -> guardar un nuevo cliente
    function GuardarClienteRespaldo(cliente) {

        // mensaje de flujo
        console.log("BD: se guardara un cliente con los siguientes datos:")
        console.log(cliente)

        // Paso -> guardar al cliente
        let Respuesta = Cliente.GuardarCliente(cliente)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }
    }

    // Funcion -> eliminar un cliente
    function EliminarCliente(clienteID) {

        // mensaje de flujo
        console.log("BD: se eliminar al cliente con ID:")
        console.log(clienteID)

        // Paso -> eliminar al cliente
        let Respuesta = Cliente.EliminarCliente(clienteID)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }
    }

    // Funcion -> obtener todos los clientes
    function ObtenerTablaClientes (){

        // mensaje de flujo
        console.log("BD: se obtendra todos los clientes")

        // Paso -> obtener tabla
        let Respuesta = Cliente.ObtenerListaClientes()
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false,"ListaDeClientes":Respuesta.ListaDeClientes})
        }

    }

    // Funcion -> editar un cliente
    function EditarCliente(clienteActualizado) {

        // mensaje de flujo
        console.log("BD: se editara al cliente estos datos y ID:")
        console.log(clienteActualizado)

        // Paso -> editar al cliente
        let Respuesta = Cliente.EditarCliente(clienteActualizado)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }

    }

// -------------------------------------- GESTION DE MOVIMIENTOS ------------------------------------------------

    // Función para guardar movimientos en un archivo JSON con asignación automática de ID
    function GuardarMovimientoRespaldo(movimiento) {

        // mensaje de flujo
        console.log("BD: se guardar el siguiente movimiento economico")
        console.log(movimiento)

        let Respuesta = MovimientoDeDinero.GuardarMovimientoEconomico(movimiento)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }

    }

    function ObtenerTablaMovimientos (FechaInicial,FechaFinal){

        // mensaje de flujo
        console.log("BD: se obtendra todos los movimientos economicos")

        let Respuesta = MovimientoDeDinero.ObtenerMovimientosEconomicos(FechaInicial,FechaFinal)
        console.log(Respuesta)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false,"ListaMovimentosEconomicos":Respuesta.ListaMovimientosEconomicos})
        }

    }

    function AplicarFiltros (Cliente,FechaInicial,FechaFinal){

        let ListaMovimentosEconomicos = []

        // mensaje de flujo
        console.log("BD: se aplicara el filtro en los movimientos de dinero")
        console.log("BD: Cliente: ",Cliente," FechaInicial: ",FechaInicial," FechaFinal: ",FechaFinal)

        // Paso -> verificar que tiene una fecha indicada
        if(FechaInicial && FechaFinal){
            let Respuesta = MovimientoDeDinero.ObtenerMovimientosEconomicos(FechaInicial,FechaFinal)
            if(Respuesta.error == true){
                return ({"error":true})
            }else{
                ListaMovimentosEconomicos = Respuesta.ListaMovimientosEconomicos
                // Paso -> aplicar el filtro de clientes
                switch(Cliente){
                    case "todos":
                        return ({"error":false,"ListaMovimientosEconomicos":ListaMovimentosEconomicos})
                    default:
                        let ListaFiltrada = ListaMovimentosEconomicos.filter(Movimiento => Movimiento.ClienteID == Cliente)
                        return ({"error":false,"ListaMovimientosEconomicos":ListaFiltrada})
                }

            }
        }else{
            return ({"error":true})
        }
    }

    // Funcion -. eliminar un movimiento de dinero
    function EliminarMovimiento(movimientoID) {

        // mensaje de flujo
        console.log("BD: se eliminara un movimiento de dinero")
        console.log("BD: movimientoID: ",movimientoID)

        let Respuesta = MovimientoDeDinero.EliminarMovimientoEconomico(movimientoID)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }
    }

// ------------------------------------------- GESTIONAR VENTAS OCASIONALES ----------------------------------------

function TablaCV(fechaInicial,fechaFinal) {

    // Paso -> obtener la lista
    let respuesta = VentaOcasional.ObtenerListaVentaOcasional(fechaInicial,fechaFinal)
    if(respuesta.error == true){
        return ({"error":true})
    }else{
        return ({"error":false,"listaCV":respuesta.ListaFiltrada})
    }

}

function GuardarCompraVenta(datosCompraVenta) {

    // mensaje de flujo
    console.log("BD: se guardara una commpra venta con los siguientes datos:")
    console.log(datosCompraVenta)

    // Paso -> guardar la compra venta
    let Respuesta = VentaOcasional.GuardarVentaOcasional(datosCompraVenta)
    if(Respuesta.error == true){
        return ({"error":true})
    }else{
        return ({"error":false})
    }
}

function EliminarCompraVenta(detalleCompraVenta) {

    // mensaje de flujo
    console.log("BD: se eliminara la siguiente venta ocasional: ")
    console.log(detalleCompraVenta)

    // Paso -> eliminar la compra venta
    let Respuesta = VentaOcasional.EliminarVentaOcasional(detalleCompraVenta)
    if(Respuesta.error == true){
        return ({"error":true})
    }else{
        return ({"error":false})
    }
}

// ------------------------------- GESTIONAR MOVIMIENTOS MATERIALES -----------------------------------

    // Funcion -> obtener todos los movimientos materiales
    function ObtenerTablaMovimientosMateriales(FechaInicial,FechaFinal) {

        // mensaje de flujo
        console.log("BD: se obtendra la tabla de movimientos materiales, en este rango: ")
        console.log("FechaIncial: ",FechaInicial," FechaFinal: ",FechaFinal)

        // Paso -> obtener la lista
        let Respuesta = MovimientoMaterial.ObtenerMovimientosMaterial(FechaInicial,FechaFinal)
        if(Respuesta.error == true){
            console.log("BD: no se obtuvo con exito ")
            return ({"error":true})
        }else{
            console.log("BD: se obtuvo con exito ")
            return ({"error":false,"ListaMovimientosMateriales":Respuesta.ListaMovimientosMateriales})
        }
    
    }

    // Función para guardar movimientos materiales en un archivo JSON con asignación automática de ID
    function GuardarMovimientoMaterial(Movimiento) {

        // mensaje de flujo
        console.log("BD: se guardar el siguiente movimiento material")
        console.log(Movimiento)

        let Respuesta = MovimientoMaterial.GuardarMovimientoMaterial(Movimiento)
        if(Respuesta.error == true){
            console.log("BD: no se pudo guardar el movimiento material")
            return ({"error":true})
        }else{
            console.log("BD: si se pudo guardar el movimiento material")
            return ({"error":false})
        }

    }

    // Funcion -> filtrar movimientos materiales
    function FiltrarMovimientosMateriales (Cliente,FechaInicial,FechaFinal){

        let ListaMovimientosMateriales = []

        // mensaje de flujo
        console.log("BD: se aplicara el filtro en los movimientos materiales")
        console.log("BD: Cliente: ",Cliente," FechaInicial: ",FechaInicial," FechaFinal: ",FechaFinal)

        // Paso -> verificar que tiene una fecha indicada
        if(FechaInicial && FechaFinal){
            let Respuesta = MovimientoMaterial.ObtenerMovimientosMaterial(FechaInicial,FechaFinal)
            if(Respuesta.error == true){
                return ({"error":true})
            }else{
                ListaMovimientosMateriales = Respuesta.ListaMovimientosMateriales
                // Paso -> aplicar el filtro de clientes
                switch(Cliente){
                    case "todos":
                        return ({"error":false,"ListaMovimientosMateriales":ListaMovimientosMateriales})
                    default:
                        let ListaFiltrada = ListaMovimientosMateriales.filter(Movimiento => Movimiento.ClienteID == Cliente)
                        return ({"error":false,"ListaMovimientosMateriales":ListaFiltrada})
                }

            }
        }else{
            return ({"error":true})
        }
    }

    // Funcion -. eliminar un movimiento de material
    function EliminarMovimientoMaterial(movimientoID) {

        // mensaje de flujo
        console.log("BD: se eliminara un movimiento de material")
        console.log("BD: movimientoID: ",movimientoID)

        let Respuesta = MovimientoMaterial.EliminarMovimientoMaterial(movimientoID)
        if(Respuesta.error == true){
            return ({"error":true})
        }else{
            return ({"error":false})
        }
    }

    // --------------------------------------- GESTIONAR LA CUENTA EMPRESARIAL --------------------------------
    
    // Funcion -> obtener el capital economico
    function ObtenerCapitalEconomicoEmpresarial (){

        // mensaje de flujo
        console.log("DB: obteniendo el capital economico empresarial")

        // Paso -> pedir
        let Respuesta = CuentaEmpresarial.ObtenerCapitalEconomicoActual()
        if(Respuesta.error == true){
            console.log("BD: no se pudo obtener el capital economico empresarial")
            return ({"error":true})
        }else{
            console.log("BD: si se pudo obtener el capital economico empresarial")
            return ({"error":false,"CapitalEconomico":Respuesta.CapitalEconomico})
        }

    }

    // Funcion -> obtener el capital material
    function ObtenerCapitalMaterialEmpresarial (){

        // mensaje de flujo
        console.log("DB: obteniendo el capital material empresarial")

        // Paso -> pedir
        let Respuesta = CuentaEmpresarial.ObtenerCapitalMaterialActual()
        if(Respuesta.error == true){
            console.log("BD: no se pudo obtener el capital material empresarial")
            return ({"error":true})
        }else{
            console.log("BD: si se pudo obtener el capital material empresarial")
            return ({"error":false,"CapitalMaterial":Respuesta.CapitalMaterial})
        }
        
    }

    function ObtenerListaCapturas (){

        // mensaje de flujo
        console.log("BD: obteniendo todas las capturas")

        let Respuesta = CapturaCuenta.ObtenerListaDeCapturas()
        if(Respuesta.error == true){
            console.log("BD: no se pudo obtener las capturas")
            return ({"error":true})
        }else{
            console.log("BD: si se pudo obtener las capturas")
            return ({"error":false,"ListaCapturas":Respuesta.ListaDeCapturas})
        }

    }

module.exports = {
    GuardarUsuarioRespaldo,
    ObtenerTablaUsuarios,
    EliminarUsuario,
    EditarUsuario,
    GuardarClienteRespaldo,
    ObtenerTablaClientes,
    EliminarCliente,
    EditarCliente,
    GuardarMovimientoRespaldo,
    ObtenerTablaMovimientos,
    EliminarMovimiento,
    AplicarFiltros,
    TablaCV,
    GuardarCompraVenta,
    EliminarCompraVenta,
    ObtenerTablaMovimientosMateriales,
    GuardarMovimientoMaterial,
    FiltrarMovimientosMateriales,
    EliminarMovimientoMaterial,
    ObtenerCapitalEconomicoEmpresarial,
    ObtenerCapitalMaterialEmpresarial,
    ObtenerListaCapturas
};
