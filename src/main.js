const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const xlsx = require("xlsx");
const shell = require("electron").shell;
const fs = require("fs");
const ExcelJS = require("exceljs");

const { exec } = require('child_process');
const PDFDocument = require('pdfkit');

// Importar sistema de privilegios y gestor de sesión
const SistemaPrivilegios = require('./componentes/SistemaPrivilegios.js');
const GestorSesion = require('./componentes/GestorSesion.js');

function generarPDF(data) {
    console.log("Generando PDF...");

    // Definir tamaño de papel para 80 mm de ancho
    const doc = new PDFDocument({ size: [226, 1000], margins: { top: 10, left: 10, right: 10, bottom: 10 } });

    const filePath = `boleta.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc
        .fontSize(10).text('INVERSIONES REDSUR', { align: 'center', bold: true })
        .text('OFICINA: HUEPETUHE', { align: 'center' })
        .moveDown()
        .text(`FECHA: ${data.Fecha}`)
        .text(`REFERENCIA: ${data.ID}`)
        .moveDown()
        .fontSize(12).text(`===== BOLETA DE ${data.Tipo} =====`, { align: 'center' })
        .moveDown()
        .fontSize(10).text(`Cliente: ${data.ClienteN}`)
        .text(`A favor de:`)
        .text(`Importe: ${data.Importe}`)
        .moveDown()
        .text('------------   ------------', { align: 'center' })
        .moveDown()
        .text(`CAJERO: ${data.ClienteN}`, { align: 'left' })
        .moveDown()
        .text('===================', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
        console.log(`✅ PDF generado: ${filePath}`);

        // Abrir automáticamente el archivo después de crearlo
        const command = process.platform === 'win32' ? `start "" "${filePath}"` : process.platform === 'darwin' ? `open "${filePath}"` : `xdg-open "${filePath}"`;

        exec(command, (err) => {
            if (err) {
                console.error("❌ Error al abrir el PDF:", err);
            } else {
                console.log("📂 PDF abierto correctamente.");
            }
        });
    });

    stream.on('error', (error) => console.error("❌ Error al generar el PDF:", error));
}


// BD de respaldo
const BDrespaldo = require('./BDrespaldo/BDrespaldo.js')
const Impresora = require('./componentes/Impresora.js')

let mainWindow;
let loginWindow
let respuesta
let SelectUserWindow

// ====================================================================================================
// FUNCIÓN AUXILIAR PARA VALIDAR PRIVILEGIOS
// ====================================================================================================

/**
 * Valida si el usuario actual tiene privilegio para realizar una acción
 * @param {string} modulo - Nombre del módulo (ej: "clientes", "usuarios")
 * @param {string} accion - Acción a validar (ej: "crear", "editar", "eliminar")
 * @param {object} event - Evento IPC para enviar mensaje de error si no tiene privilegio
 * @returns {boolean} - true si tiene privilegio, false en caso contrario
 */
function validarPrivilegio(modulo, accion, event) {
    const rol = GestorSesion.obtenerRolActual();

    if (!rol) {
        console.error(`Main: No hay usuario autenticado`);
        if (event) {
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeMalo",
                texto: "No hay sesión activa. Por favor, inicie sesión nuevamente."
            });
        }
        return false;
    }

    const tienePrivilegio = SistemaPrivilegios.verificarPrivilegio(rol, modulo, accion);

    if (!tienePrivilegio) {
        console.warn(`Main: Usuario con rol "${rol}" no tiene privilegio para ${modulo}.${accion}`);
        if (event) {
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeMalo",
                texto: "No tienes permisos para realizar esta acción"
            });
        }
        return false;
    }

    return true;
}

// --------------------------------------- DIARIO ---------------------------------------

// 

// --------------------------------------- LOGICA ---------------------------------------
app.whenReady().then(() => {
    // Paso -> cargar la ventana de login antes de iniciar
    loginWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false, // Opcional: evita que el usuario cambie el tamaño
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    loginWindow.loadFile("./src/componentes/login.html")
    loginWindow.removeMenu();
    // obtener los empleados
    let empleados = BDrespaldo.ObtenerTablaUsuarios()
    loginWindow.webContents.send("InicializarLogin", empleados) // cargar por default 
});

// 🎯 Escuchar el evento desde `menu.js` y reenviarlo a la ventana
ipcMain.on("menu-seleccionado", (event, datos) => {
    console.log("Opción recibida en main.js:", datos.pantalla);
    if (mainWindow) {
        mainWindow.webContents.send("actualizar-contenido", datos);
    }
});

ipcMain.on("EAutenticarUsuario", (event, datos) => {
    // Mensaje de flujo
    console.log("MENSAJE: se validará los datos del usuario");
    console.log("Datos recibidos:", datos);

    // Obtener usuarios desde la base de datos
    let usuarios = BDrespaldo.ObtenerTablaUsuarios();

    // Buscar usuario con ID y Contraseña coincidentes
    let usuarioEncontrado = usuarios.find(usuario =>
        usuario.ID == datos.ID && usuario.Contrasena == datos.Contrasena
    );

    if (usuarioEncontrado) {
        // Paso -> Establecer usuario en el GestorSesion
        GestorSesion.establecerUsuario(usuarioEncontrado);

        // Paso -> Obtener privilegios del rol del usuario
        const privilegios = SistemaPrivilegios.obtenerPrivilegiosRol(usuarioEncontrado.Rol);

        console.log(`Autenticación exitosa: ${usuarioEncontrado.Nombres} (${usuarioEncontrado.Rol})`);
        console.log("Privilegios del usuario:", privilegios);

        // Paso -> cerrar la ventana de login
        loginWindow.close()

        // Paso -> abrir la ventana principal
        mainWindow = new BrowserWindow({
            show: false, // Para que no parpadee la ventana al maximizarse
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false // ⚠️ Permite usar `require()` en el frontend (opcional)
            }
        });
        mainWindow.maximize(); // Maximiza la ventana
        mainWindow.show(); // Ahora sí la mostramos
        mainWindow.loadFile("./src/index.html"); // cargar el codigo html de la primera ventana

        // Paso -> Preparar datos con usuario y privilegios
        let datos = {
            "usuarioIngresado": usuarioEncontrado,
            "privilegios": privilegios,
            "pantalla": "CuentaEmpresarial"
        }

        mainWindow.webContents.send("mostrarMenu", datos)
        mainWindow.webContents.send("actualizar-contenido", datos) // cargar por default 
    } else {
        console.log("Error: Usuario o contraseña incorrectos");
    }
});

ipcMain.on("ECerrarSesion", (event) => {

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de cerrar la sesion?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);
    if (respuesta === 1) {
        console.log("MENSAJE: cerrando sesion")

        // Paso -> Cerrar sesión en el GestorSesion
        GestorSesion.cerrarSesion();

        mainWindow.close()
    } else {
        console.log("MENSAJE: se cancelo el cierre de sesion")
    }

})

// ------------------------------------- EVENTOS DE COMPRA VENTA ---------------------------------------

// evento -> quiere gestionar compra venta
ipcMain.on("EQuiereGestionarCompraVenta", (event, usuarioAutenticado) => {

    // mensaje de flujo
    console.log("MENSAJE: se invoco al evento quiere gestionar compra venta")
    console.log("MENSAJE: este es el usuario que gestionara la compra venta")
    console.log(usuarioAutenticado)

    // filtrar lista por fechas
    let fecha = ObtenerFecha(); // Obtener la fecha actual
    let respuesta = BDrespaldo.TablaCV(fecha, fecha)

    if (respuesta.error == false) {
        // paso -> obtener datos
        let datos = {
            "listaCV": respuesta.listaCV,
            "fecha": fecha,
            "usuarioAutenticado": usuarioAutenticado
        }

        // paso -> cargar el componente compra venta
        event.sender.send("ECargarComponenteCompraVenta", datos)
    }

})

// evento -> guardar nueva compra venta
ipcMain.on("EQuiereGuardarNuevoCompraVenta", (event, datosCompraVenta) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("compraVenta", "crear", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: guardando nuevo compra venta, estos son los datos:")
    console.log(datosCompraVenta)

    // Paso -> agregar la hora a la compra venta
    datosCompraVenta.Hora = ObtenerHora()

    // Paso -> guardar en la base de datos el nuevo cliente
    respuesta = BDrespaldo.GuardarCompraVenta(datosCompraVenta)

    // Paso -> mostrar mensaje al usuario
    if (respuesta.error == false) {// se guardo sin errores

        // mensaje de flujo
        console.log("MENSAJE: la compra venta se guardo sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "La compra venta se guardó correctamente"
        });

        // Paso -> obtener la lista de compra venta
        let fecha = ObtenerFecha(); // Obtener la fecha actual
        let respuesta = BDrespaldo.TablaCV(fecha, fecha)
        if (respuesta.error == false) {
            // paso -> cargar el componente compra venta
            console.log("asdfasfdsdasfdfasdfasdfasdfasdfsdafdsafasdfsdafasd")
            console.log(respuesta.listaCV)
            event.sender.send("EActualizarTablaCompraVenta", respuesta.listaCV)
        }

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("MENSAJE: la compra venta no se pudo guardar")

        // Paso -> informar al usuario
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "La compra venta no se guardó correctamente"
        });
    }
})

// Evento -> filtrar la lista tabla clientes
ipcMain.on("EFiltrarListaCV", (event, datos) => {

    console.log("---------- Filtrando lista de CV ----------");
    console.log("Fechas recibidas:", datos);

    // Obtener la lista completa
    let respuesta = BDrespaldo.TablaCV(datos.fechaInicio, datos.fechaFinal);

    console.log(respuesta)

    // Enviar la lista filtrada al frontend
    event.sender.send("EActualizarTablaCompraVenta", respuesta.listaCV);
});

// Evento -> eliminar compra venta
ipcMain.on("EEliminarCV", (event, datosCompraVenta) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("compraVenta", "eliminar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: eliminando compra venta, estos son los datos:")
    console.log(datosCompraVenta)

    // Paso -> eliminar en la base de datos el cliente
    respuesta = BDrespaldo.EliminarCompraVenta(datosCompraVenta)

    if (respuesta.error == true) {
        console.log("Main: no se pudo eliminar la compra venta")
        // Paso -> informar al usuario
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "La compra venta no se pudo eliminar correctamente"
        });
    } else {
        console.log("Main: se elimino la compra venta")
        // Paso -> informar al usuario
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "La compra venta se elimino correctamente"
        });
        // Enviar la lista filtrada al frontend
        event.sender.send("EActualizarTablaCompraVenta", respuesta.listaCV);
    }
})

// ------------------------------------- EVENTOS CON EL USUARIO --------------------------------------

// Evento -> guardar usuario
ipcMain.on("BotonGuardarUsuarioActivado", (event, usuario) => {

    // mensaje de flujo
    console.log("MENSAJE: se invoco al evento guardar usuario")
    console.log("MENSAJE: este es el usuario que se guardara: ")
    console.log(usuario)

    // Paso -> guardar usuario
    respuesta = BDrespaldo.GuardarUsuarioRespaldo(usuario)

    // Paso -> mostrar mensaje al usuario
    if (respuesta) {// se guardo sin errores
        console.log("MENSAJE: el usuario se guardo sin errores")
        event.sender.send("UsuarioGuardadoExitosamente", {
            exito: true,
            mensaje: "El usuario se guardó correctamente"
        });
        let usuarios = BDrespaldo.ObtenerTablaUsuarios()
        console.log(usuarios)
        event.sender.send("ActualizarTabla", {
            usuarios: usuarios
        })
    } else {// no se pudo guardar
        console.log("MENSAJE: el usuario no se pudo guardar")
        event.sender.send("ErrorAlGuardarUsuario", {
            exito: false,
            mensaje: "Hubo un error al guardar el usuario"
        });
    }

})

// Eventos 

// ------------------------------------ MENU ---------------------------------

function ObtenerFecha() {
    let hoy = new Date(); // Obtener la fecha actual

    // Obtener año, mes y día con formato adecuado (dos dígitos)
    let año = hoy.getFullYear();
    let mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11, por eso sumamos 1
    let dia = String(hoy.getDate()).padStart(2, '0');

    // Formatear la fecha en "YYYY-MM-DD"
    let fecha = `${año}-${mes}-${dia}`;

    return fecha;
}

function ObtenerHora() {
    let ahora = new Date(); // Obtener la hora actual

    // Obtener horas, minutos y segundos con formato adecuado (dos dígitos)
    let horas = String(ahora.getHours()).padStart(2, '0');
    let minutos = String(ahora.getMinutes()).padStart(2, '0');
    let segundos = String(ahora.getSeconds()).padStart(2, '0');

    // Formatear la hora en "HH:MM:SS"
    let hora = `${horas}:${minutos}:${segundos}`;

    return hora;
}


// Evento -> gestionar clientes
ipcMain.on("EQuiereGestionarCuentaEmpresarial", (event) => {

    // mensaje de flujo
    console.log("Main: se llamo al evento gestionar cuenta empresarial")

    let Respuesta
    let CapitalEconomico
    let CapitalMaterial
    let ListaCapturas

    // Paso -> obtener el capital economico
    Respuesta = BDrespaldo.ObtenerCapitalEconomicoEmpresarial()
    if (Respuesta.error == false) {
        CapitalEconomico = Respuesta.CapitalEconomico
    }

    // Paso -> obtener el capital material
    Respuesta = BDrespaldo.ObtenerCapitalMaterialEmpresarial()
    if (Respuesta.error == false) {
        CapitalMaterial = Respuesta.CapitalMaterial
    }

    // Paso -> obtener todos los clientes en la base de datos 
    Respuesta = BDrespaldo.ObtenerListaCapturas()
    if (Respuesta.error == false) {
        ListaCapturas = Respuesta.ListaCapturas
    }

    // Paso -> agrupar datos
    let datos = {
        "diarios": ListaCapturas,
        "CapitalEconomico": CapitalEconomico,
        "CapitalMaterial": CapitalMaterial,
        "fecha": ObtenerFecha()
    }

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("EInicializarVentanaCuentaEmpresarial", datos)
})

// ------------------------------------ GESTIONAR CLIENTES --------------------------------------

// Evento -> cargar ventana clientes
ipcMain.on("EQuiereGestionarClientes", (event) => {

    // mensaje de flujo
    console.log("Main: se llamo al evento gestionar clientes")

    // Paso -> obtener todos los clientes en la base de datos 
    let Respuesta = BDrespaldo.ObtenerTablaClientes()

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("EMostrarVentanaGestionarClientes", Respuesta.ListaDeClientes)

})

// Evento -> guardar un nuevo cliente
ipcMain.on("EGuardarNuevoCliente", (event, Cliente) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("clientes", "crear", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: guardando un nuevo cliente, estos son los datos:");
    console.log(Cliente)

    // Paso -> guardar en la base de datos el nuevo cliente
    respuesta = BDrespaldo.GuardarClienteRespaldo(Cliente)
    // Paso -> mostrar mensaje al usuario
    if (respuesta.error == false) {// se guardo sin errores

        // mensaje de flujo
        console.log("Main: el cliente se guardo sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El cliente se guardó correctamente"
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let res = BDrespaldo.ObtenerTablaClientes()
        event.sender.send("ActualizarTablaClientes", res.ListaDeClientes)

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("Main: el usuario no se pudo guardar")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Hubo un error al guardar el usuario"
        });
    }
})

// Evento -> eliminar un cliente
ipcMain.on("EEliminarCliente", (event, Cliente) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("clientes", "eliminar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // Mensaje de flujo
    console.log("Main: Se eliminara el siguiente cliente:");
    console.log(Cliente);

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar al cliente ${Cliente.Nombres} ${Cliente.Apellidos}?`,
    };

    const respuesta = dialog.showMessageBoxSync(null, opciones);
    if (respuesta === 1) {

        console.log("Main: Se ha confirmado su decision");

        // Paso -> eliminar cliente
        let Respuesta = BDrespaldo.EliminarCliente(Cliente.ID)
        // Paso -> mostrar mensaje al usuario
        if (Respuesta.error == false) {// se guardo sin errores

            // mensaje de flujo
            console.log("Main: el cliente se elimino sin errores")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El cliente se elimino correctamente"
            });

            // Paso -> actualizar la tabla de clientes en la ventana
            let res = BDrespaldo.ObtenerTablaClientes()
            event.sender.send("ActualizarTablaClientes", res.ListaDeClientes)

        } else {// no se pudo guardar

            // mensaje de flujo
            console.log("Main: el cliente no se pudo eliminar")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeMalo",
                texto: "Hubo un error al eliminar al cliente"
            });
        }

    } else {
        console.log("Main: no se ha confirmado su decision");
    }
});

ipcMain.on("EEditarCliente", (event, cliente) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("clientes", "editar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: editando los datos de este cliente: ")
    console.log(cliente)

    // Paso -> editar los datos en la base de datos
    let Respuesta = BDrespaldo.EditarCliente(cliente)
    // Paso -> mostrar mensaje al usuario
    if (Respuesta.error == false) {// se guardo sin errores

        // mensaje de flujo
        console.log("Main: el cliente se edito sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El cliente se edito correctamente"
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let res = BDrespaldo.ObtenerTablaClientes()
        event.sender.send("ActualizarTablaClientes", res.ListaDeClientes)

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("Main: el cliente no se pudo editar")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Hubo un error al editar al cliente"
        });
    }

})

// Evento -> mostrar formulario editar cliente
ipcMain.on("EQuiereFormularioEditarCliente", (event, cliente) => {

    // mensaje de flujo
    console.log("MENSAJE: se mostrara el formulario editar cliente con estos datos:")
    console.log(cliente)

    // Paso -> mandar un evento para cambiar los formularios
    event.sender.send("EMostrarFormularioEditarCliente", cliente)

})

// Evento -> el boton del encabezado a sido activado
ipcMain.on("BotonEncabezadoActivado", (event, NombreVentana) => {
    console.log("actualizar: ")
    console.log(NombreVentana)
})

// Evento -> actualizar formulario nuevo cliente
ipcMain.on("ActualizarFormularioNuevoCliente", (event) => {

    // mensaje de flujo
    console.log("MENSAJE: se pondra el formulario nuevo cliente en su estado original")

    // Paso -> enviar un evento al archivo cliente para actualizar el formulario
    event.sender.send("EActualizarFormularioNuevoCliente")

})

// Evento -> hacer funcionar el buscador
ipcMain.on("EBuscarCliente", (event, dato) => {

    console.log("Main: evento buscar cliente activado");
    console.log(`Main: el cliente que se buscará es: ${dato}`);

    // Obtener la lista de clientes
    let Respuesta = BDrespaldo.ObtenerTablaClientes()
    // Expresión regular para buscar en cualquier parte del nombre o apellido (sin distinguir mayúsculas/minúsculas)
    let regex = new RegExp(dato, "i");
    // Filtrar clientes que coincidan con la búsqueda en nombre o apellido
    let clientesFiltrados = Respuesta.ListaDeClientes.filter(cliente =>
        regex.test(cliente.Nombres) || regex.test(cliente.Apellidos)
    );

    // Enviar el resultado al frontend
    event.sender.send("ActualizarTablaClientes", clientesFiltrados)
});

// Evento -> seleccionar cliente
ipcMain.on("EQuiereSeleccionarCliente", (event) => {

    // mensaje de flujo
    console.log("Main: quiere seleccionar un cliente")

    // Paso -> mostrar la ventana
    SelectUserWindow = new BrowserWindow({
        width: 500,
        height: 700,
        resizable: false, // Opcional: evita que el usuario cambie el tamaño
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    SelectUserWindow.loadFile("./src/componentes/SelectUserWindow.html")
    //SelectUserWindow.removeMenu();
    // obtener los empleados
    let Respuesta = BDrespaldo.ObtenerTablaClientes()
    SelectUserWindow.webContents.send("EInicializarSelectUserWindow", Respuesta.ListaDeClientes) // cargar por default 

})

// --------------------------------------- GESTIONAR MOVIMIENTOS --------------------------------------------

// Evento -> gestionar movimientos
ipcMain.on("EQuiereGestionarMovimientos", (event, datos) => {

    // mensaje de flujo
    console.log("--> Main: se llamo al evento gestionar movimientos")

    // Paso -> obtener todos los clientes en la base de datos 
    let FechaActual = ObtenerFecha()
    let datosNuevos
    let MovimientosEconomicos = BDrespaldo.ObtenerTablaMovimientos(FechaActual, FechaActual)
    console.log("--> Main: estos son los mov economicos :")
    console.log(MovimientosEconomicos)
    if (MovimientosEconomicos.error == false) {
        datosNuevos = {
            "usuario": datos.usuarioIngresado,
            "clientes": BDrespaldo.ObtenerTablaClientes().ListaDeClientes,
            "movimientos": MovimientosEconomicos.ListaMovimentosEconomicos,
            "Fecha": ObtenerFecha()
        }
    } else {
        datosNuevos = {
            "usuario": datos.usuarioIngresado,
            "clientes": BDrespaldo.ObtenerTablaClientes().ListaDeClientes,
            "movimientos": MovimientosEconomicos.ListaMovimentosEconomicos,
            "Fecha": ObtenerFecha()
        }
    }

    console.log("-> Main: este son los datos nuevos: ")
    console.log(datosNuevos)

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("EMostrarVentanaGestionarMovimientos", datosNuevos)

})

// Evento -> guardar un nuevo movimiento
ipcMain.on("EGuardarNuevoMovimiento", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosEconomicos", "crear", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: guardando un nuevo movimiento, estos son los datos:")
    console.log(Movimiento)

    // Paso -> asignar la hora
    Movimiento.Hora = ObtenerHora()

    // Paso -> guarda en la base de datos el movimiento
    let Respuesta = BDrespaldo.GuardarMovimientoRespaldo(Movimiento)

    // Paso -> mostrar mensaje al usuario
    if (Respuesta.error == false) {// se guardo sin errores

        // mensaje de flujo
        console.log("Main: el movimiento se guardo sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El movimiento se guardó correctamente"
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let fecha = ObtenerFecha()
        let Respuesta = BDrespaldo.ObtenerTablaMovimientos(fecha, fecha)
        if (Respuesta.error == false) {
            // Paso -> actualizar tabla
            event.sender.send("ActualizarTablaMovimientos", Respuesta.ListaMovimentosEconomicos)
        }

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("Main: el movimiento no se pudo guardar")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Hubo un error al guardar el movimiento"
        });
    }
})

ipcMain.on("EEliminarMovimiento", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosEconomicos", "eliminar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: eliminando un movimiento, este es el movimiento:")
    console.log(Movimiento)

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar el movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        console.log("Main: la decision fue confirmada");

        let Respuesta = BDrespaldo.EliminarMovimiento(Movimiento.ID)
        if (Respuesta.error == true) {
            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeMalo",
                texto: "El movimiento no se pudo eliminar"
            });
        } else {
            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El movimiento si se pudo eliminar"
            });
            // Paso -> actualizar la tabla de clientes en la ventana
            let fecha = ObtenerFecha()
            let Respuesta = BDrespaldo.ObtenerTablaMovimientos(fecha, fecha)
            if (Respuesta.error == false) {
                // Paso -> actualizar tabla
                event.sender.send("ActualizarTablaMovimientos", Respuesta.ListaMovimentosEconomicos)
            }
        }
    } else {
        console.log("Main: no se confirmo la decision");
    }
})

// Evento -> imprimir commpra venta
ipcMain.on("EQuiereImprimirCV", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("compraVenta", "imprimir", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: se imprimira compra venta: ")
    console.log(Movimiento)

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas imprimir este movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);
    if (respuesta === 1) {
        // Paso -> mandar a imprimir 
        Impresora.ImprimirCompraVenta(Movimiento)

        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El movimiento compra/venta se imprimio correctamente"
        });
    } else {
        console.log("La impresion del movimiento ha sido cancelada.");
    }
})

ipcMain.on("EImprimirMovimiento", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosEconomicos", "imprimir", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: imprimiendo un movimiento")
    console.log("MEJAE: el movimiento es: ")
    console.log(Movimiento)

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas imprimir este movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        // Paso -> mandar a imprimir 
        Impresora.ImprimirMovimientoEconomico(Movimiento)

        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El movimiento se imprimio correctamente correctamente"
        });
    } else {
        console.log("La impresion del movimiento ha sido cancelada.");
    }
})

ipcMain.on("EImprimirMovimientoMaterial", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosMateriales", "imprimir", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: imprimiendo un movimiento")
    console.log("MEJAE: el movimiento es: ")
    console.log(Movimiento)

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas imprimir este movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        // Paso -> mandar a imprimir 
        Impresora.ImprimirMovimientoMaterial(Movimiento)

        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El movimiento se imprimio correctamente correctamente"
        });
    } else {
        console.log("La impresion del movimiento ha sido cancelada.");
    }
})

// Evento -> actualizar formulario nuevo cliente
ipcMain.on("ActualizarFormularioNuevoMovimiento", (event) => {

    // mensaje de flujo
    console.log("MENSAJE: se pondra el formulario nuevo movimiento en su estado original")

    // Paso -> obtener clientes
    let clientes = BDrespaldo.ObtenerTablaClientes()

    // Paso -> enviar un evento al archivo cliente para actualizar el formulario
    event.sender.send("EActualizarFormularioNuevoMovimiento", clientes)

})

// Evento -> filtrar los movimientos
ipcMain.on("EFiltrarMovimientos", (event, datos) => {

    let Respuesta = BDrespaldo.AplicarFiltros(datos.cliente, datos.fechaInicio, datos.fechaFinal)
    if (Respuesta.error == true) {
        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo aplicar los filtros"
        });
    } else {
        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "Si se aplicaron los filtros"
        });
        // Paso -> actualizar la tabla
        event.sender.send("ActualizarTablaMovimientos", Respuesta.ListaMovimientosEconomicos)
    }
})

ipcMain.on("EDescargarTablaMovimientos", (event, movimientos) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("reportes", "descargar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    console.log("MENSAJE: estos son los datos que se descargarán de la tabla:");
    console.log(movimientos);

    // Obtener la carpeta de descargas del usuario
    const carpetaDescargas = app.getPath("downloads");
    let nombreArchivo = "movimientos.xlsx";
    let rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
    let contador = 1;

    // Si el archivo ya existe, buscar un nombre disponible
    while (fs.existsSync(rutaArchivo)) {
        nombreArchivo = `movimientos (${contador}).xlsx`;
        rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
        contador++;
    }

    try {
        /*
        // Crear una hoja de cálculo
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(movimientos);
 
        // Agregar la hoja al libro
        xlsx.utils.book_append_sheet(wb, ws, "Movimientos");
 
        // Escribir el archivo Excel en la ruta disponible
        xlsx.writeFile(wb, rutaArchivo);
 
        console.log(`MENSAJE: Archivo guardado en ${rutaArchivo}`);
 
        // Abrir el archivo automáticamente después de guardarlo
        shell.openPath(rutaArchivo);
 
        // Enviar mensaje de éxito al frontend
        event.sender.send("ModificarMensaje", { 
            tipo: "MensajeBueno", 
            texto: `El Excel se descargó con éxito: ${nombreArchivo}` 
        });
        */

        /* V2

        // Transformar los datos en el formato correcto
        const datosProcesados = movimientos.map(mov => ({
            Fecha: mov.Fecha,
            Hora: mov.Hora,
            ClienteNombres: mov.ClienteNombres,
            UsuarioNombres: mov.UsuarioNombres,
            Observacion: mov.Observacion,
            INGRESO: mov.Tipo === "Ingreso" ? mov.Importe : 0,
            EGRESO: mov.Tipo === "Retiro" ? mov.Importe : 0,
            SALDO: mov.CapturaSaldo
        }));

        // Crear hoja de cálculo
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(datosProcesados);

        // Aplicar estilos a los encabezados (fila 1)
        const range = xlsx.utils.decode_range(ws["!ref"]); // Obtener rango de la hoja
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = xlsx.utils.encode_cell({ r: 0, c: col });
            if (ws[cellRef]) {
                ws[cellRef].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "FFFF00" } }, // Fondo amarillo
                    alignment: { horizontal: "center" }
                };
            }
        }

        // Aplicar colores a INGRESO, EGRESO y SALDO
        for (let row = 1; row <= range.e.r; row++) {
            ["F", "G", "H"].forEach((col, index) => {
                const cellRef = xlsx.utils.encode_cell({ r: row, c: range.s.c + 5 + index });
                if (ws[cellRef] && typeof ws[cellRef].v === "number") {
                    ws[cellRef].s = {
                        font: { color: { rgb: ws[cellRef].v > 0 ? "0000FF" : "FF0000" } }, // Azul si es positivo, rojo si es negativo
                        alignment: { horizontal: "right" }
                    };
                }
            });
        }

        // Agregar hoja al libro y guardar
        xlsx.utils.book_append_sheet(wb, ws, "Movimientos");
        xlsx.writeFile(wb, rutaArchivo);

        console.log(`MENSAJE: Archivo guardado en ${rutaArchivo}`);

        // Abrir el archivo automáticamente después de guardarlo
        shell.openPath(rutaArchivo);

        // Enviar mensaje de éxito al frontend
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: `El Excel se descargó con éxito: ${rutaArchivo}`
        });
        */
        // Crear un nuevo libro de trabajo y una hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Movimientos");

        // Definir las columnas en el orden correcto
        worksheet.columns = [
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Cliente", key: "ClienteNombres", width: 20 },
            { header: "Usuario", key: "UsuarioNombres", width: 20 },
            { header: "Observación", key: "Observacion", width: 30 },
            { header: "INGRESO", key: "INGRESO", width: 15 },
            { header: "EGRESO", key: "EGRESO", width: 15 },
            { header: "SALDO", key: "SALDO", width: 15 }
        ];

        // Agregar datos transformados
        movimientos.forEach(mov => {
            worksheet.addRow({
                Fecha: mov.Fecha,
                Hora: mov.Hora,
                ClienteNombres: mov.ClienteNombres,
                UsuarioNombres: mov.UsuarioNombres,
                Observacion: mov.Observacion,
                INGRESO: mov.Tipo === "Ingreso" ? mov.Importe : 0,
                EGRESO: mov.Tipo === "Retiro" ? mov.Importe : 0,
                SALDO: mov.CapturaSaldo
            });
        });

        // Aplicar estilo al encabezado (amarillo con negrita)
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
            cell.alignment = { horizontal: "center" };
        });

        // Aplicar colores a INGRESO, EGRESO y SALDO
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Omitimos la primera fila (encabezado)
                const ingresoCell = row.getCell(6);
                const egresoCell = row.getCell(7);
                const saldoCell = row.getCell(8);

                [ingresoCell, egresoCell, saldoCell].forEach(cell => {
                    if (cell.value > 0) {
                        cell.font = { color: { argb: "0000FF" } }; // Azul para valores positivos
                    } else if (cell.value < 0) {
                        cell.font = { color: { argb: "FF0000" } }; // Rojo para valores negativos
                    }
                    cell.alignment = { horizontal: "right" }; // Alineación derecha
                });
            }
        });

        // Guardar el archivo Excel usando .then() en lugar de await
        workbook.xlsx.writeFile(rutaArchivo)
            .then(() => {
                console.log(`MENSAJE: Archivo guardado en ${rutaArchivo}`);

                // Abrir el archivo automáticamente después de guardarlo
                shell.openPath(rutaArchivo);

                // Enviar mensaje de éxito al frontend
                event.sender.send("ModificarMensaje", {
                    tipo: "MensajeBueno",
                    texto: `El Excel se descargó con éxito: ${rutaArchivo}`
                });
            })
            .catch(error => {
                console.error("Error al guardar el archivo:", error);
                event.sender.send("ModificarMensaje", {
                    tipo: "MensajeError",
                    texto: "Hubo un error al generar el archivo Excel."
                });
            });

    } catch (error) {
        console.error("ERROR: No se pudo generar el archivo Excel", error);
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo descargar el Excel"
        });
    }
});

// Evento -> gestionar usuarios
ipcMain.on("EQuiereGestionarUsuarios", (event) => {

    // mensaje de flujo
    console.log("MENSAJE: se llamo al evento gestionar usuarios")

    // Paso -> obtener todos los clientes en la base de datos 
    let usuarios = BDrespaldo.ObtenerTablaUsuarios()

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("EMostrarVentanaGestionarUsuarios", usuarios)

})

// Evento -> guardar un nuevo usuario
ipcMain.on("EGuardarNuevoUsuario", (event, Usuario) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("usuarios", "crear", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: guardando un nuevo usuario, estos son los datos:")
    console.log(Usuario)

    // Paso -> guardar en la base de datos el nuevo cliente
    respuesta = BDrespaldo.GuardarUsuarioRespaldo(Usuario)

    // Paso -> mostrar mensaje al usuario
    if (respuesta.estado) {// se guardo sin errores

        // mensaje de flujo
        console.log("MENSAJE: el usuario se guardo sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El usuario se guardó correctamente"
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let usuarios = BDrespaldo.ObtenerTablaUsuarios()
        event.sender.send("ActualizarTablaUsuarios", usuarios)

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("MENSAJE: el usuario no se pudo guardar")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Hubo un error al guardar el usuario",
            error: respuesta.error
        });
    }
})

ipcMain.on("EEliminarUsuario", (event, Usuario) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("usuarios", "eliminar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // Mensaje de flujo
    console.log("MENSAJE: Se eliminara un usuario, los datos son:");
    console.log(Usuario);

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar al usuario ${Usuario.Nombres} ${Usuario.Apellidos}?`,
    };

    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        console.log("Eliminando usuario...");

        // Paso -> eliminar usuario
        BDrespaldo.EliminarUsuario(Usuario.ID)

        // Paso -> actualizar la tabla de clientes en la ventana
        let usuarios = BDrespaldo.ObtenerTablaUsuarios()
        event.sender.send("ActualizarTablaUsuarios", usuarios)

        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El usuario se elimino correctamente"
        });

        // Aquí puedes agregar la lógica para eliminar el cliente del archivo o la base de datos
    } else {
        console.log("La eliminación del usuario ha sido cancelada.");
    }
});

// Evento -> mostrar formulario editar usuario
ipcMain.on("EQuiereFormularioEditarUsuario", (event, usuario) => {

    // mensaje de flujo
    console.log("MENSAJE: se mostrara el formulario editar usuario con estos datos:")
    console.log(usuario)

    // Paso -> mandar un evento para cambiar los formularios
    event.sender.send("EMostrarFormularioEditarUsuario", usuario)

})

ipcMain.on("EEditarUsuario", (event, usuario) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("usuarios", "editar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("MENSAJE: editando los datos de este usuario: ")
    console.log(usuario)

    // Paso -> editar los datos en la base de datos
    BDrespaldo.EditarUsuario(usuario)

    // Paso -> actualizar el mensaje
    event.sender.send("ModificarMensaje", {
        tipo: "MensajeBueno",
        texto: "El usuario se guardó correctamente"
    });

    // Paso -> actualizar la tabla de clientes en la ventana
    let usuarios = BDrespaldo.ObtenerTablaUsuarios()
    event.sender.send("ActualizarTablaUsuarios", usuarios)

})

// Evento -> actualizar formulario nuevo cliente
ipcMain.on("ActualizarFormularioNuevoUsuario", (event) => {

    // mensaje de flujo
    console.log("MENSAJE: se pondra el formulario nuevo usuario en su estado original")

    // Paso -> enviar un evento al archivo cliente para actualizar el formulario
    event.sender.send("EActualizarFormularioNuevoUsuario")

})

ipcMain.on("EBuscarUsuario", (event, dato) => {

    console.log("MENSAJE: evento buscar usuario activado");
    console.log(`MENSAJE: el usuario que se buscará es: ${dato}`);

    // Obtener la lista de clientes
    let usuarios = BDrespaldo.ObtenerTablaUsuarios();

    // Expresión regular para buscar en cualquier parte del nombre o apellido (sin distinguir mayúsculas/minúsculas)
    let regex = new RegExp(dato, "i");

    // Filtrar clientes que coincidan con la búsqueda en nombre o apellido
    let usuariosFiltrados = usuarios.filter(usuario =>
        regex.test(usuario.Nombres) || regex.test(usuario.Apellidos)
    );

    console.log("Clientes encontrados:", usuariosFiltrados);

    // Enviar el resultado al frontend
    event.sender.send("ActualizarTablaUsuarios", usuariosFiltrados)
});

ipcMain.on("EClienteSeleccionado", (event, cliente) => {

    // mensaje de flujo
    console.log("MENSAJE: ya se ha seleccionado un cliente")
    console.log(cliente)

    SelectUserWindow.close()
    mainWindow.webContents.send("EActualizarSoloCliente", cliente)
    //event.sender.send("EActualizarSoloCliente",cliente)

})

// ------------------------------------ GESTIONAR MOVIMIENTOS MATERIALES ---------------------------------------

// Evento -> cargar la pantalla para gestionar movimiento materiales
ipcMain.on("EQuiereGestionarMovimientosMateriales", (event, UsuarioAutenticado) => {

    // mensaje de flujo
    console.log("Main: se mostrara la pantalla de gestionar movimientos materiales")
    console.log("Main: el usuario autenticado es: ", UsuarioAutenticado)

    let Respuesta
    let ListaClientes
    let ListaMovimientosMateriales
    let FechaActual = ObtenerFecha()
    let Datos

    // Paso -> obtener la lista de clientes
    Respuesta = BDrespaldo.ObtenerTablaClientes()
    if (Respuesta.error == true) {
        console.log("Main: no se pudo obtener la lista de clientes")
        ListaClientes = []
    } else {
        console.log("Main: si se pudo obtener la lista de clientes")
        ListaClientes = Respuesta.ListaDeClientes
    }

    // Paso -> obtener la lista de movimientos
    Respuesta = BDrespaldo.ObtenerTablaMovimientosMateriales(FechaActual, FechaActual)
    if (Respuesta.error == true) {
        console.log("Main: no se pudo obtener la lista de movimientos materiales")
        ListaMovimientosMateriales = []
    } else {
        console.log("Main: si se pudo obtener la lista de movimientos materiales")
        ListaMovimientosMateriales = Respuesta.ListaMovimientosMateriales
    }

    // Paso -> agrupar los datos
    Datos = {
        "UsuarioAutenticado": UsuarioAutenticado,
        "ListaClientes": ListaClientes,
        "ListaMovimientosMateriales": ListaMovimientosMateriales,
        "Fecha": FechaActual
    }
    console.log("Main: estos son los datos enviados para cargar pantalla: ")
    console.log(Datos)

    // Paso -> enviar el evento
    event.sender.send("EMostrarVentanaGestionarMovimientosMateriales", Datos)

})

// Evento -> guardar un nuevo movimiento material
ipcMain.on("EGuardarNuevoMovimientoMaterial", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosMateriales", "crear", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: guardando un nuevo movimiento material, estos son los datos:")
    console.log(Movimiento)

    // Paso -> asignar la hora
    Movimiento.Hora = ObtenerHora()
    if (Movimiento.Observacion.trim() === "") {
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "El campo Observacion es obligatorio."
        });
        return;
    }


    // Paso -> guarda en la base de datos el movimiento
    let Respuesta = BDrespaldo.GuardarMovimientoMaterial(Movimiento)

    // Paso -> mostrar mensaje al usuario
    if (Respuesta.error == false) {// se guardo sin errores

        // mensaje de flujo
        console.log("Main: el movimiento se guardo sin errores")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "El movimiento se guardó correctamente"
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let fecha = ObtenerFecha()
        let Respuesta = BDrespaldo.ObtenerTablaMovimientosMateriales(fecha, fecha)
        if (Respuesta.error == false) {
            // Paso -> actualizar tabla
            event.sender.send("ActualizarTablaMovimientosMateriales", Respuesta.ListaMovimientosMateriales)
        }

    } else {// no se pudo guardar

        // mensaje de flujo
        console.log("Main: el movimiento no se pudo guardar")

        // Paso -> mostrar el mensaje en la ventana
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Hubo un error al guardar el movimiento"
        });
    }
})

// Evento -> filtrar los movimientos materiales
ipcMain.on("EFiltrarMovimientosMateriales", (event, datos) => {

    let Respuesta = BDrespaldo.FiltrarMovimientosMateriales(datos.cliente, datos.fechaInicio, datos.fechaFinal)
    if (Respuesta.error == true) {
        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo aplicar los filtros"
        });
    } else {
        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: "Si se aplicaron los filtros"
        });
        // Paso -> actualizar la tabla
        event.sender.send("ActualizarTablaMovimientosMateriales", Respuesta.ListaMovimientosMateriales)
    }
})

ipcMain.on("EEliminarMovimientoMaterial", (event, Movimiento) => {

    // Paso -> Validar privilegio
    if (!validarPrivilegio("movimientosMateriales", "eliminar", event)) {
        return; // Detener ejecución si no tiene privilegio
    }

    // mensaje de flujo
    console.log("Main: eliminando un movimiento material, este es el movimiento:")
    console.log(Movimiento)

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar el movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        console.log("Main: la decision fue confirmada");

        let Respuesta = BDrespaldo.EliminarMovimientoMaterial(Movimiento.ID)
        if (Respuesta.error == true) {
            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeMalo",
                texto: "El movimiento no se pudo eliminar"
            });
        } else {
            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El movimiento si se pudo eliminar"
            });
            // Paso -> actualizar la tabla de clientes en la ventana
            let fecha = ObtenerFecha()
            let Respuesta = BDrespaldo.ObtenerTablaMovimientosMateriales(fecha, fecha)
            if (Respuesta.error == false) {
                // Paso -> actualizar tabla
                event.sender.send("ActualizarTablaMovimientosMateriales", Respuesta.ListaMovimientosMateriales)
            }
        }
    } else {
        console.log("Main: no se confirmo la decision");
    }
})


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
