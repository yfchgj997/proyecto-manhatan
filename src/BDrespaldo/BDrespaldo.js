const { REFUSED } = require("dns");
const fs = require("fs");
const path = require("path");



// OBJETOS

const VentaOcasional = require(path.join(__dirname, "../objetos/VentaOcasional/VentaOcasional.js"))
const MovimientoDeDinero = require(path.join(__dirname, "../objetos/MovimientoDeDinero/MovimientoDeDinero.js"))
const MovimientoMaterial = require(path.join(__dirname, "../objetos/MovimientoDeMaterial/MovimientoDeMaterial.js"))
const Cliente = require(path.join(__dirname, "../objetos/Cliente/Cliente.js"))
const CuentaEmpresarial = require(path.join(__dirname, "../objetos/CuentaEmpresarial/CuentaEmpresarial.js"))
const CapturaCuenta = require(path.join(__dirname, "../objetos/CapturaDeCuenta/CapturaDeCuenta.js"))
const Usuarios = require(path.join(__dirname, "../objetos/Usuarios/Usuarios.js"));

// Función para guardar clientes en un archivo JSON con asignación automática de ID
function GuardarUsuarioRespaldo(usuario) {

    // mensaje de flujo
    console.log("BD: se guardara un usuario con los siguientes datos:")
    console.log(usuario)

    // Paso -> guardar al usuario
    let Respuesta = Usuarios.GuardarUsuario(usuario)
    if (Respuesta.error == true) {
        return ({ "error": true, "estado": false })
    } else {
        return ({ "error": null, "estado": true })
    }
}

function ObtenerTablaUsuarios() {

    // mensaje de flujo
    console.log("BD: se obtendra todos los usuarios")

    // Paso -> obtener tabla
    let Respuesta = Usuarios.ObtenerListaUsuarios()
    if (Respuesta.error == true) {
        return []
    } else {
        return Respuesta.ListaDeUsuarios
    }

}

function EliminarUsuario(usuarioID) {

    // mensaje de flujo
    console.log("BD: se eliminara al usuario con ID:")
    console.log(usuarioID)

    // Paso -> eliminar al usuario
    let Respuesta = Usuarios.EliminarUsuario(usuarioID)
    if (Respuesta.error == true) {
        return false
    } else {
        return true
    }
}

function EditarUsuario(usuarioActualizado) {

    // mensaje de flujo
    console.log("BD: se editara al usuario estos datos y ID:")
    console.log(usuarioActualizado)

    // Paso -> editar al usuario
    let Respuesta = Usuarios.EditarUsuario(usuarioActualizado)
    if (Respuesta.error == true) {
        return false
    } else {
        return true
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
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

// Funcion -> eliminar un cliente
function EliminarCliente(clienteID) {

    // mensaje de flujo
    console.log("BD: se eliminar al cliente con ID:")
    console.log(clienteID)

    // Paso -> eliminar al cliente
    let Respuesta = Cliente.EliminarCliente(clienteID)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

// Funcion -> obtener todos los clientes
function ObtenerTablaClientes() {

    // mensaje de flujo
    console.log("BD: se obtendra todos los clientes")

    // Paso -> obtener tabla
    let Respuesta = Cliente.ObtenerListaClientes()
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false, "ListaDeClientes": Respuesta.ListaDeClientes })
    }

}

// Funcion -> editar un cliente
function EditarCliente(clienteActualizado) {

    // mensaje de flujo
    console.log("BD: se editara al cliente estos datos y ID:")
    console.log(clienteActualizado)

    // Paso -> editar al cliente
    let Respuesta = Cliente.EditarCliente(clienteActualizado)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }

}

// -------------------------------------- GESTION DE MOVIMIENTOS ------------------------------------------------

// Función para guardar movimientos en un archivo JSON con asignación automática de ID
function GuardarMovimientoRespaldo(movimiento) {

    // mensaje de flujo
    console.log("BD: se guardar el siguiente movimiento economico")
    console.log(movimiento)

    let Respuesta = MovimientoDeDinero.GuardarMovimientoEconomico(movimiento)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }

}

function ObtenerTablaMovimientos(FechaInicial, FechaFinal) {

    // mensaje de flujo
    console.log("BD: se obtendra todos los movimientos economicos")

    let Respuesta = MovimientoDeDinero.ObtenerMovimientosEconomicos(FechaInicial, FechaFinal)
    console.log(Respuesta)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false, "ListaMovimentosEconomicos": Respuesta.ListaMovimientosEconomicos })
    }

}

function AplicarFiltros(Cliente, FechaInicial, FechaFinal) {

    let ListaMovimentosEconomicos = []

    // mensaje de flujo
    console.log("BD: se aplicara el filtro en los movimientos de dinero")
    console.log("BD: Cliente: ", Cliente, " FechaInicial: ", FechaInicial, " FechaFinal: ", FechaFinal)

    // Paso -> verificar que tiene una fecha indicada
    if (FechaInicial && FechaFinal) {
        let Respuesta = MovimientoDeDinero.ObtenerMovimientosEconomicos(FechaInicial, FechaFinal)
        if (Respuesta.error == true) {
            return ({ "error": true })
        } else {
            ListaMovimentosEconomicos = Respuesta.ListaMovimientosEconomicos
            // Paso -> aplicar el filtro de clientes
            switch (Cliente) {
                case "todos":
                    return ({ "error": false, "ListaMovimientosEconomicos": ListaMovimentosEconomicos })
                default:
                    let ListaFiltrada = ListaMovimentosEconomicos.filter(Movimiento => Movimiento.ClienteID == Cliente)
                    return ({ "error": false, "ListaMovimientosEconomicos": ListaFiltrada })
            }

        }
    } else {
        return ({ "error": true })
    }
}

// Funcion -. eliminar un movimiento de dinero
function EliminarMovimiento(movimientoID) {

    // mensaje de flujo
    console.log("BD: se eliminara un movimiento de dinero")
    console.log("BD: movimientoID: ", movimientoID)

    let Respuesta = MovimientoDeDinero.EliminarMovimientoEconomico(movimientoID)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

// ------------------------------------------- GESTIONAR VENTAS OCASIONALES ----------------------------------------

function TablaCV(fechaInicial, fechaFinal) {

    // Paso -> obtener la lista
    let respuesta = VentaOcasional.ObtenerListaVentaOcasional(fechaInicial, fechaFinal)
    if (respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false, "listaCV": respuesta.ListaFiltrada })
    }

}

function GuardarCompraVenta(datosCompraVenta) {

    // mensaje de flujo
    console.log("BD: se guardara una commpra venta con los siguientes datos:")
    console.log(datosCompraVenta)

    // Paso -> guardar la compra venta
    let Respuesta = VentaOcasional.GuardarVentaOcasional(datosCompraVenta)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

function EliminarCompraVenta(detalleCompraVenta) {

    // mensaje de flujo
    console.log("BD: se eliminara la siguiente venta ocasional: ")
    console.log(detalleCompraVenta)

    // Paso -> eliminar la compra venta
    let Respuesta = VentaOcasional.EliminarVentaOcasional(detalleCompraVenta)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

// ------------------------------- GESTIONAR MOVIMIENTOS MATERIALES -----------------------------------

// Funcion -> obtener todos los movimientos materiales
function ObtenerTablaMovimientosMateriales(FechaInicial, FechaFinal) {

    // mensaje de flujo
    console.log("BD: se obtendra la tabla de movimientos materiales, en este rango: ")
    console.log("FechaIncial: ", FechaInicial, " FechaFinal: ", FechaFinal)

    // Paso -> obtener la lista
    let Respuesta = MovimientoMaterial.ObtenerMovimientosMaterial(FechaInicial, FechaFinal)
    if (Respuesta.error == true) {
        console.log("BD: no se obtuvo con exito ")
        return ({ "error": true })
    } else {
        console.log("BD: se obtuvo con exito ")
        return ({ "error": false, "ListaMovimientosMateriales": Respuesta.ListaMovimientosMateriales })
    }

}

// Función para guardar movimientos materiales en un archivo JSON con asignación automática de ID
function GuardarMovimientoMaterial(Movimiento) {

    // mensaje de flujo
    console.log("BD: se guardar el siguiente movimiento material")
    console.log(Movimiento)

    let Respuesta = MovimientoMaterial.GuardarMovimientoMaterial(Movimiento)
    if (Respuesta.error == true) {
        console.log("BD: no se pudo guardar el movimiento material")
        return ({ "error": true })
    } else {
        console.log("BD: si se pudo guardar el movimiento material")
        return ({ "error": false })
    }

}

// Funcion -> filtrar movimientos materiales
function FiltrarMovimientosMateriales(Cliente, FechaInicial, FechaFinal) {

    let ListaMovimientosMateriales = []

    // mensaje de flujo
    console.log("BD: se aplicara el filtro en los movimientos materiales")
    console.log("BD: Cliente: ", Cliente, " FechaInicial: ", FechaInicial, " FechaFinal: ", FechaFinal)

    // Paso -> verificar que tiene una fecha indicada
    if (FechaInicial && FechaFinal) {
        let Respuesta = MovimientoMaterial.ObtenerMovimientosMaterial(FechaInicial, FechaFinal)
        if (Respuesta.error == true) {
            return ({ "error": true })
        } else {
            ListaMovimientosMateriales = Respuesta.ListaMovimientosMateriales
            // Paso -> aplicar el filtro de clientes
            switch (Cliente) {
                case "todos":
                    return ({ "error": false, "ListaMovimientosMateriales": ListaMovimientosMateriales })
                default:
                    let ListaFiltrada = ListaMovimientosMateriales.filter(Movimiento => Movimiento.ClienteID == Cliente)
                    return ({ "error": false, "ListaMovimientosMateriales": ListaFiltrada })
            }

        }
    } else {
        return ({ "error": true })
    }
}

// Funcion -. eliminar un movimiento de material
function EliminarMovimientoMaterial(movimientoID) {

    // mensaje de flujo
    console.log("BD: se eliminara un movimiento de material")
    console.log("BD: movimientoID: ", movimientoID)

    let Respuesta = MovimientoMaterial.EliminarMovimientoMaterial(movimientoID)
    if (Respuesta.error == true) {
        return ({ "error": true })
    } else {
        return ({ "error": false })
    }
}

// --------------------------------------- GESTIONAR LA CUENTA EMPRESARIAL --------------------------------

// Funcion -> obtener el capital economico
function ObtenerCapitalEconomicoEmpresarial() {

    // mensaje de flujo
    console.log("DB: obteniendo el capital economico empresarial")

    // Paso -> pedir
    let Respuesta = CuentaEmpresarial.ObtenerCapitalEconomicoActual()
    if (Respuesta.error == true) {
        console.log("BD: no se pudo obtener el capital economico empresarial")
        return ({ "error": true })
    } else {
        console.log("BD: si se pudo obtener el capital economico empresarial")
        return ({ "error": false, "CapitalEconomico": Respuesta.CapitalEconomico })
    }

}

// Funcion -> obtener el capital material
function ObtenerCapitalMaterialEmpresarial() {

    // mensaje de flujo
    console.log("DB: obteniendo el capital material empresarial")

    // Paso -> pedir
    let Respuesta = CuentaEmpresarial.ObtenerCapitalMaterialActual()
    if (Respuesta.error == true) {
        console.log("BD: no se pudo obtener el capital material empresarial")
        return ({ "error": true })
    } else {
        console.log("BD: si se pudo obtener el capital material empresarial")
        return ({ "error": false, "CapitalMaterial": Respuesta.CapitalMaterial })
    }

}

function ObtenerListaCapturas() {

    // mensaje de flujo
    console.log("BD: obteniendo todas las capturas")

    let Respuesta = CapturaCuenta.ObtenerListaDeCapturas()
    if (Respuesta.error == true) {
        console.log("BD: no se pudo obtener las capturas")
        return ({ "error": true })
    } else {
        console.log("BD: si se pudo obtener las capturas")
        return ({ "error": false, "ListaCapturas": Respuesta.ListaDeCapturas })
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
