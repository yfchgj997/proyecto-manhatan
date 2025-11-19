const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");



// Ejemplo de uso
generarPDF({
    Fecha: "2025-03-19",
    ID: "123456",
    Tipo: "VENTA",
    clienteN: "Juan Pérez",
    Importe: "S/ 150.00"
});


// Ejemplo de uso
generarPDF({
    Fecha: "2025-03-19",
    ID: "123456",
    Tipo: "VENTA",
    clienteN: "Juan Pérez",
    Importe: "S/ 150.00"
});



// BD de respaldo
const BDrespaldo = require('./BDrespaldo/BDrespaldo.js')

let mainWindow;
let loginWindow
let respuesta
let SelectUserWindow

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
    loginWindow.loadFile("./componentes/login.html")
    loginWindow.removeMenu();
    // obtener los empleados
    let empleados = BDrespaldo.ObtenerTablaUsuarios()
    loginWindow.webContents.send("InicializarLogin",empleados) // cargar por default 
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
        // Paso -> cerrar la ventana de login
        loginWindow.close()

        // Paso -> abrir la otra ventana
        console.log("Autenticación exitosa:", usuarioEncontrado);
        mainWindow = new BrowserWindow({
            show: false, // Para que no parpadee la ventana al maximizarse
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false // ⚠️ Permite usar `require()` en el frontend (opcional)
            }
        });
        mainWindow.maximize(); // Maximiza la ventana
        mainWindow.show(); // Ahora sí la mostramos
        mainWindow.loadFile("index.html"); // cargar el codigo html de la primera ventana
        let datos = {
            "usuarioIngresado":usuarioEncontrado,
            "pantalla":"VerMovimientos"
        }
        mainWindow.webContents.send("mostrarMenu",datos)
        mainWindow.webContents.send("actualizar-contenido",datos) // cargar por default 
    } else {
        console.log("Error: Usuario o contraseña incorrectos");
    }
});

ipcMain.on("ECerrarSesion",(event)=>{

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de cerrar la sesion?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);
    if(respuesta === 1){
        console.log("MENSAJE: cerrando sesion")
        mainWindow.close()
    }else{
        console.log("MENSAJE: se cancelo el cierre de sesion")
    }

})


// ------------------------------------- EVENTOS CON EL USUARIO --------------------------------------

// Evento -> guardar usuario
ipcMain.on("BotonGuardarUsuarioActivado",(event,usuario)=>{

    // mensaje de flujo
    console.log("MENSAJE: se invoco al evento guardar usuario")
    console.log("MENSAJE: este es el usuario que se guardara: ")
    console.log(usuario)

    // Paso -> guardar usuario
    respuesta = BDrespaldo.GuardarUsuarioRespaldo(usuario)

    // Paso -> mostrar mensaje al usuario
    if(respuesta){// se guardo sin errores
        console.log("MENSAJE: el usuario se guardo sin errores")
        event.sender.send("UsuarioGuardadoExitosamente", { 
            exito: true, 
            mensaje: "El usuario se guardó correctamente" 
        });
        let usuarios = BDrespaldo.ObtenerTablaUsuarios()
        console.log(usuarios)
        event.sender.send("ActualizarTabla",{
            usuarios: usuarios
        })
    }else{// no se pudo guardar
        console.log("MENSAJE: el usuario no se pudo guardar")
        event.sender.send("ErrorAlGuardarUsuario", { 
            exito: false, 
            mensaje: "Hubo un error al guardar el usuario" 
        });
    }

})

// Eventos 

    // Evento -> gestionar clientes
    ipcMain.on("EQuiereGestionarClientes",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: se llamo al evento gestionar clientes")

        // Paso -> obtener todos los clientes en la base de datos 
        let clientes = BDrespaldo.ObtenerTablaClientes()

        // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
        event.sender.send("EMostrarVentanaGestionarClientes",clientes)

    })

    // Evento -> guardar un nuevo cliente
    ipcMain.on("EGuardarNuevoCliente",(event,Cliente)=>{
        
        // mensaje de flujo
        console.log("MENSAJE: guardando un nuevo cliente, estos son los datos:")
        console.log(Cliente)

        // Paso -> guardar en la base de datos el nuevo cliente
        respuesta = BDrespaldo.GuardarClienteRespaldo(Cliente)

        // Paso -> mostrar mensaje al usuario
        if(respuesta){// se guardo sin errores

            // mensaje de flujo
            console.log("MENSAJE: el cliente se guardo sin errores")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El cliente se guardó correctamente" 
            });

            // Paso -> actualizar la tabla de clientes en la ventana
            let clientes = BDrespaldo.ObtenerTablaClientes()
            event.sender.send("ActualizarTablaClientes",clientes)

        }else{// no se pudo guardar

            // mensaje de flujo
            console.log("MENSAJE: el usuario no se pudo guardar")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeMalo",
                texto: "Hubo un error al guardar el usuario" 
            });
        }
    })

    ipcMain.on("EEliminarCliente",(event,Cliente)=>{

        // Mensaje de flujo
        console.log("MENSAJE: Se eliminara un cliente, los datos son:");
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
            console.log("Eliminando cliente...");

            // Paso -> eliminar cliente
            BDrespaldo.EliminarCliente(Cliente.ID)

            // Paso -> actualizar la tabla de clientes en la ventana
            let clientes = BDrespaldo.ObtenerTablaClientes()
            event.sender.send("ActualizarTablaClientes",clientes)

            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El cliente se elimino correctamente" 
            });

            // Aquí puedes agregar la lógica para eliminar el cliente del archivo o la base de datos
        } else {
            console.log("La eliminación del cliente ha sido cancelada.");
        }
    });

    ipcMain.on("EEditarCliente",(event,cliente)=>{

        // mensaje de flujo
        console.log("MENSAJE: editando los datos de este cliente: ")
        console.log(cliente)

        // Paso -> editar los datos en la base de datos
        BDrespaldo.EditarCliente(cliente)

        // Paso -> actualizar el mensaje
        event.sender.send("ModificarMensaje", { 
            tipo: "MensajeBueno", 
            texto: "El cliente se guardó correctamente" 
        });

        // Paso -> actualizar la tabla de clientes en la ventana
        let clientes = BDrespaldo.ObtenerTablaClientes()
        event.sender.send("ActualizarTablaClientes",clientes)

    })

    // Evento -> mostrar formulario editar cliente
    ipcMain.on("EQuiereFormularioEditarCliente",(event,cliente)=>{

        // mensaje de flujo
        console.log("MENSAJE: se mostrara el formulario editar cliente con estos datos:")
        console.log(cliente)

        // Paso -> mandar un evento para cambiar los formularios
        event.sender.send("EMostrarFormularioEditarCliente",cliente)

    })

    // Evento -> el boton del encabezado a sido activado
    ipcMain.on("BotonEncabezadoActivado",(event,NombreVentana)=>{
        console.log("actualizar: ")
        console.log(NombreVentana)
    })

    // Evento -> actualizar formulario nuevo cliente
    ipcMain.on("ActualizarFormularioNuevoCliente",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: se pondra el formulario nuevo cliente en su estado original")

        // Paso -> enviar un evento al archivo cliente para actualizar el formulario
        event.sender.send("EActualizarFormularioNuevoCliente")

    })

    // Evento -> gestionar movimientos
    ipcMain.on("EQuiereGestionarMovimientos",(event,datos)=>{

        // mensaje de flujo
        console.log("MENSAJE: se llamo al evento gestionar movimientos")

        // Paso -> obtener todos los clientes en la base de datos 

        let datosNuevos = {
            "usuario":datos.usuarioIngresado,
            "clientes":BDrespaldo.ObtenerTablaClientes(),
            "movimientos":BDrespaldo.ObtenerTablaMovimientos()
        }

        // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
        event.sender.send("EMostrarVentanaGestionarMovimientos",datosNuevos)

    })

    // Evento -> guardar un nuevo movimiento
    ipcMain.on("EGuardarNuevoMovimiento",(event,Movimiento)=>{
        
        // mensaje de flujo
        console.log("MENSAJE: guardando un nuevo movimiento, estos son los datos:")
        console.log(Movimiento)

        // Paso -> guardar en la base de datos el nuevo cliente
        respuesta = BDrespaldo.GuardarMovimientoRespaldo(Movimiento)

        // Paso -> mostrar mensaje al usuario
        if(respuesta){// se guardo sin errores

            // mensaje de flujo
            console.log("MENSAJE: el movimiento se guardo sin errores")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El movimiento se guardó correctamente" 
            });

            // Paso -> actualizar la tabla de clientes en la ventana
            let movimientos = BDrespaldo.ObtenerTablaMovimientos()
            event.sender.send("ActualizarTablaMovimientos",movimientos)

        }else{// no se pudo guardar

            // mensaje de flujo
            console.log("MENSAJE: el movimiento no se pudo guardar")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeMalo",
                texto: "Hubo un error al guardar el movimiento" 
            });
        }
    })

    ipcMain.on("EEliminarMovimiento",(event,Movimiento)=>{

        // mensaje de flujo
        console.log("MENSAJE: eliminando un movimiento, este es el movimiento:")
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
            console.log("Eliminando movimiento...");

            // Paso -> contrarestar saldo
            BDrespaldo.ContrarestarSaldo(Movimiento)
            BDrespaldo.EliminarMovimiento(Movimiento.ID)

            // Paso -> actualizar la tabla de clientes en la ventana
            let movimientos = BDrespaldo.ObtenerTablaMovimientos()
            event.sender.send("ActualizarTablaMovimientos",movimientos)

            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El movimiento se elimino correctamente" 
            });

            // Aquí puedes agregar la lógica para eliminar el cliente del archivo o la base de datos
        } else {
            console.log("La eliminación del movimiento ha sido cancelada.");
        }
    })

    ipcMain.on("EImprimirMovimiento",(event,Movimiento)=>{

        // mensaje de flujo
        console.log("MENSAJE: imprimiendo un movimiento")
        console.log("MESJAE: el movimiento es: ")
        console.log(Movimiento)

        // Paso -> mostrar la ventana de confirmacion
        const opciones = {
            type: "question",
            buttons: ["Cancelar", "Aceptar"],
            defaultId: 0,
            title: "Confirmación",
            message: `¿Estás seguro de que deseas imprimir este movimiento?`,
        };
        console.log("esperando respuesta")
        const respuesta = dialog.showMessageBoxSync(null, opciones);
        console.log("la respuesta es: ")
        console.log(respuesta)
        if(respuesta === 1){
            console.log("aasdfasdf")
            // Paso -> mandar a imprimir 
            //mandarImpresion(Movimiento)
            generarPDF(Movimiento)

            // Paso -> actualizar el mensaje
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El movimiento se imprimio correctamente correctamente" 
            });
        }else {
            console.log("La impresion del movimiento ha sido cancelada.");
        }
    })

    // Evento -> actualizar formulario nuevo cliente
    ipcMain.on("ActualizarFormularioNuevoMovimiento",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: se pondra el formulario nuevo movimiento en su estado original")

        // Paso -> obtener clientes
        let clientes = BDrespaldo.ObtenerTablaClientes()

        // Paso -> enviar un evento al archivo cliente para actualizar el formulario
        event.sender.send("EActualizarFormularioNuevoMovimiento",clientes)

    })

    // Evento -> filtrar los movimientos
    ipcMain.on("EFiltrarMovimientos",(event,datos)=>{

        let movimientos = BDrespaldo.AplicarFiltros(datos)
        event.sender.send("ActualizarTablaMovimientos",movimientos)

    })

    ipcMain.on("EDescargarTablaMovimientos", (event, movimientos) => {
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
    
        } catch (error) {
            console.error("ERROR: No se pudo generar el archivo Excel", error);
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeMalo", 
                texto: "No se pudo descargar el Excel" 
            });
        }
    });

    // Evento -> gestionar usuarios
    ipcMain.on("EQuiereGestionarUsuarios",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: se llamo al evento gestionar usuarios")

        // Paso -> obtener todos los clientes en la base de datos 
        let usuarios = BDrespaldo.ObtenerTablaUsuarios()

        // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
        event.sender.send("EMostrarVentanaGestionarUsuarios",usuarios)

    })

    // Evento -> guardar un nuevo usuario
    ipcMain.on("EGuardarNuevoUsuario",(event,Usuario)=>{
        
        // mensaje de flujo
        console.log("MENSAJE: guardando un nuevo usuario, estos son los datos:")
        console.log(Usuario)

        // Paso -> guardar en la base de datos el nuevo cliente
        respuesta = BDrespaldo.GuardarUsuarioRespaldo(Usuario)

        // Paso -> mostrar mensaje al usuario
        if(respuesta.estado){// se guardo sin errores

            // mensaje de flujo
            console.log("MENSAJE: el usuario se guardo sin errores")

            // Paso -> mostrar el mensaje en la ventana
            event.sender.send("ModificarMensaje", { 
                tipo: "MensajeBueno", 
                texto: "El usuario se guardó correctamente" 
            });

            // Paso -> actualizar la tabla de clientes en la ventana
            let usuarios = BDrespaldo.ObtenerTablaUsuarios()
            event.sender.send("ActualizarTablaUsuarios",usuarios)

        }else{// no se pudo guardar

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

    ipcMain.on("EEliminarUsuario",(event,Usuario)=>{

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
            event.sender.send("ActualizarTablaUsuarios",usuarios)

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
    ipcMain.on("EQuiereFormularioEditarUsuario",(event,usuario)=>{

        // mensaje de flujo
        console.log("MENSAJE: se mostrara el formulario editar usuario con estos datos:")
        console.log(usuario)

        // Paso -> mandar un evento para cambiar los formularios
        event.sender.send("EMostrarFormularioEditarUsuario",usuario)

    })

    ipcMain.on("EEditarUsuario",(event,usuario)=>{

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
        event.sender.send("ActualizarTablaUsuarios",usuarios)

    })

    // Evento -> actualizar formulario nuevo cliente
    ipcMain.on("ActualizarFormularioNuevoUsuario",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: se pondra el formulario nuevo usuario en su estado original")

        // Paso -> enviar un evento al archivo cliente para actualizar el formulario
        event.sender.send("EActualizarFormularioNuevoUsuario")

    })

    ipcMain.on("EBuscarCliente", (event, dato) => {

        console.log("MENSAJE: evento buscar cliente activado");
        console.log(`MENSAJE: el cliente que se buscará es: ${dato}`);
    
        // Obtener la lista de clientes
        let clientes = BDrespaldo.ObtenerTablaClientes();
    
        // Expresión regular para buscar en cualquier parte del nombre o apellido (sin distinguir mayúsculas/minúsculas)
        let regex = new RegExp(dato, "i");
    
        // Filtrar clientes que coincidan con la búsqueda en nombre o apellido
        let clientesFiltrados = clientes.filter(cliente => 
            regex.test(cliente.Nombres) || regex.test(cliente.Apellidos)
        );
    
        console.log("Clientes encontrados:", clientesFiltrados);
    
        // Enviar el resultado al frontend
        event.sender.send("ActualizarTablaClientes",clientesFiltrados)
    });

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
        event.sender.send("ActualizarTablaUsuarios",usuariosFiltrados)
    });
    
    ipcMain.on("EQuiereSeleccionarCliente",(event)=>{

        // mensaje de flujo
        console.log("MENSAJE: quiere seleccionar un cliente")

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
        SelectUserWindow.loadFile("./componentes/SelectUserWindow.html")
        //SelectUserWindow.removeMenu();
        // obtener los empleados
        let clientes = BDrespaldo.ObtenerTablaClientes()
        SelectUserWindow.webContents.send("EInicializarSelectUserWindow",clientes) // cargar por default 

    })

    ipcMain.on("EClienteSeleccionado",(event,cliente)=>{

        // mensaje de flujo
        console.log("MENSAJE: ya se ha seleccionado un cliente")
        console.log(cliente)

        SelectUserWindow.close()
        mainWindow.webContents.send("EActualizarSoloCliente",cliente)
        //event.sender.send("EActualizarSoloCliente",cliente)

    })

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
