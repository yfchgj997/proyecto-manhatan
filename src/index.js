const { ipcRenderer } = require("electron");
const { MostrarMenu } = require('./componentes/menu.js');

require("./ventanas/clientes/clientes.js")
require("./ventanas/movimientos/movimientos.js")
require("./ventanas/usuarios/usuarios.js")
require("./ventanas/CuentaEmpresarial/cuentaEmpresarial.js")
require("./ventanas/CompraVenta/CompraVenta.js")
require("./ventanas/MovimientoMaterial/MovimientoMaterial.js")
require("./ventanas/CuentaEmpresarial/DetallesDia.js")

// Funciones 

// Funcion1 -> modificar el contenido principal
function ModificarContenido(opcion) {

    console.log("MENSAJE: se modificara el contenido principal")

    // Paso -> obtener el espacion en donde colocar el contenido
    let contenido = document.getElementById("EspacioContenido");
    if (!contenido) return;

    // Paso -> saber el contenido que se le debe mostrar segun la opcion
    switch (opcion.pantalla) {
        case "VerMovimientos":
            ipcRenderer.send("EQuiereGestionarMovimientos", opcion)// comunicar al main.js
            break;
        case "VerClientes":
            ipcRenderer.send("EQuiereGestionarClientes")// comunicar al main.js
            break;
        case "VerUsuarios":
            ipcRenderer.send("EQuiereGestionarUsuarios")
            break;
        case "CuentaEmpresarial":
            ipcRenderer.send("EQuiereGestionarCuentaEmpresarial")
            break;
        case "VentasOcasional":
            ipcRenderer.send("EQuiereGestionarCompraVenta", opcion.usuarioIngresado)
            break;
        case "MovimientoMaterial":
            ipcRenderer.send("EQuiereGestionarMovimientosMateriales", opcion.usuarioIngresado)
        default:
            contenido.innerHTML = "<p>ERROR!</p><p>no se puede mostrar el contenido principal</p>";
    }
}


ipcRenderer.on("mostrarMenu", (event, datos) => {
    console.log("mostrando menu")
    MostrarMenu(datos)
})
// Escuchar el evento desde `main.js` y actualizar contenido
ipcRenderer.on("actualizar-contenido", (event, datos) => {
    console.log("Actualizando contenido con:", datos.pantalla);
    console.log("MENSAJE: usuario ingresado: ")
    console.log(datos.usuarioIngresado)
    ModificarContenido(datos);
});