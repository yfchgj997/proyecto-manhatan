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
        console.log(`âœ… PDF generado: ${filePath}`);

        // Abrir automÃ¡ticamente el archivo despuÃ©s de crearlo
        const command = process.platform === 'win32' ? `start "" "${filePath}"` : process.platform === 'darwin' ? `open "${filePath}"` : `xdg-open "${filePath}"`;

        exec(command, (err) => {
            if (err) {
                console.error("âŒ Error al abrir el PDF:", err);
            } else {
                console.log("ðŸ“‚ PDF abierto correctamente.");
            }
        });
    });

    stream.on('error', (error) => console.error("âŒ Error al generar el PDF:", error));
}


// BD de respaldo
const BDrespaldo = require('./BDrespaldo/BDrespaldo.js')
const Impresora = require('./componentes/Impresora.js')
const MovimientoEmpresarial = require('./objetos/MovimientoEmpresarial/MovimientoEmpresarial.js')

let mainWindow;
let loginWindow
let respuesta
let SelectUserWindow
let InputMontoWindow

// ====================================================================================================
// FUNCIÃ“N AUXILIAR PARA VALIDAR PRIVILEGIOS
// ====================================================================================================

/**
 * Valida si el usuario actual tiene privilegio para realizar una acción
 * @param {string} modulo - Nombre del módulo (ej: "clientes", "usuarios")
 * @param {string} accion - AcciÃ³n a validar (ej: "crear", "editar", "eliminar")
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

// ðŸŽ¯ Escuchar el evento desde `menu.js` y reenviarlo a la ventana
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
                contextIsolation: false // âš ï¸ Permite usar `require()` en el frontend (opcional)
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
        event.sender.send("LoginFallido", "Contraseña incorrecta");
    }
});

ipcMain.on("ECerrarSesion", (event) => {

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        cancelId: 0,
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

    // Paso -> guardar en la base de datos el nuevo cliente
    let datosAGuardar = datosCompraVenta;
    let filtro = null;

    if (datosCompraVenta.filtro) {
        datosAGuardar = datosCompraVenta.movimiento;
        filtro = datosCompraVenta.filtro;
        // Asignar hora también al objeto interno si viene anidado
        datosAGuardar.Hora = ObtenerHora();
    } else {
        datosAGuardar.Hora = ObtenerHora();
    }

    respuesta = BDrespaldo.GuardarCompraVenta(datosAGuardar)

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
        let fechaInicio = ObtenerFecha();
        let fechaFinal = ObtenerFecha();

        if (filtro) {
            fechaInicio = filtro.fechaInicio;
            fechaFinal = filtro.fechaFinal;
        }

        let respuesta = BDrespaldo.TablaCV(fechaInicio, fechaFinal)
        if (respuesta.error == false) {
            // paso -> cargar el componente compra venta
            console.log("Actualizando tabla CV con filtro:", fechaInicio, fechaFinal)
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

    // Mostrar una ventana de confirmación
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        cancelId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de eliminar este registro?`,
    };
    const respuestaConfirm = dialog.showMessageBoxSync(null, opciones);

    if (respuestaConfirm !== 1) {
        console.log("Main: Eliminación de compra venta cancelada");
        return;
    }

    // Paso -> eliminar en la base de datos el cliente
    let datosAEliminar = datosCompraVenta;
    let filtro = null;

    if (datosCompraVenta.filtro) {
        datosAEliminar = datosCompraVenta.movimiento;
        filtro = datosCompraVenta.filtro;
    }

    respuesta = BDrespaldo.EliminarCompraVenta(datosAEliminar)

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

        // Enviar la lista filtrada al frontend manualmente para asegurar persistencia
        let fechaInicio = ObtenerFecha();
        let fechaFinal = ObtenerFecha();

        if (filtro) {
            fechaInicio = filtro.fechaInicio;
            fechaFinal = filtro.fechaFinal;
        }

        let resTabla = BDrespaldo.TablaCV(fechaInicio, fechaFinal);
        if (resTabla.error == false) {
            event.sender.send("EActualizarTablaCompraVenta", resTabla.listaCV);
        } else {
            // Fallback si falla la recarga manual (aunque improbable si TablaCV funciona)
            event.sender.send("EActualizarTablaCompraVenta", respuesta.listaCV);
        }
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

    // Obtener aÃ±o, mes y día con formato adecuado (dos dígitos)
    let anio = hoy.getFullYear();
    let mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11, por eso sumamos 1
    let dia = String(hoy.getDate()).padStart(2, '0');

    // Formatear la fecha en "YYYY-MM-DD"
    let fecha = `${anio}-${mes}-${dia}`;

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

// Evento -> gestionar cuenta empresarial
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

    console.log("------ enconrranfo error –-----------------------")
    console.log("Capital Economico: " + CapitalEconomico)
    console.log("Capital Material: " + CapitalMaterial)

    // Paso -> obtener todos los clientes en la base de datos 
    Respuesta = BDrespaldo.ObtenerListaCapturas()
    if (Respuesta.error == false) {
        ListaCapturas = Respuesta.ListaCapturas

        // Ordenar por fecha de más reciente a más antigua
        ListaCapturas.sort((a, b) => {
            let fechaA = new Date(a.Fecha);
            let fechaB = new Date(b.Fecha);
            return fechaA - fechaB; // Más reciente primero
        });
    }

    // Paso -> obtener usuario actual
    let usuarioActual = GestorSesion.obtenerUsuarioActual()

    // Paso -> agrupar datos
    let datos = {
        "diarios": ListaCapturas,
        "CapitalEconomico": CapitalEconomico,
        "CapitalMaterial": CapitalMaterial,
        "fecha": ObtenerFecha(),
        "rolUsuario": usuarioActual ? usuarioActual.Rol : "Cajero"
    }

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("EInicializarVentanaCuentaEmpresarial", datos)
})

// Evento -> ver detalles de movimientos empresariales
ipcMain.on("EQuiereVerDetallesMovimientosEmpresariales", (event) => {
    console.log("Main: solicitando ver detalles de movimientos empresariales")

    let respuesta = MovimientoEmpresarial.ObtenerMovimientos()
    let movimientos = []

    if (respuesta.error == false) {
        movimientos = respuesta.Elementos

        // Ordenar movimientos por fecha y hora (reciente a antiguo)
        movimientos.sort((a, b) => {
            let fechaA = new Date(`${a.Fecha}T${a.Hora}`);
            let fechaB = new Date(`${b.Fecha}T${b.Hora}`);
            return fechaB - fechaA;
        });
    }

    event.sender.send("ECargarTablaMovimientosEmpresariales", movimientos)
})

// Evento -> exportar movimientos empresariales a Excel
ipcMain.on("EQuiereExportarMovimientosEmpresariales", async (event) => {
    console.log("Main: exportando movimientos empresariales a Excel");

    // Obtener movimientos
    let respuesta = MovimientoEmpresarial.ObtenerMovimientos();
    if (respuesta.error) {
        console.error("Main: Error al obtener movimientos para exportar");
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Error al obtener datos para exportar"
        });
        return;
    }

    let movimientos = respuesta.Elementos;

    // Ordenar por Fecha y Hora
    movimientos.sort((a, b) => {
        let fechaA = new Date(`${a.Fecha}T${a.Hora}`);
        let fechaB = new Date(`${b.Fecha}T${b.Hora}`);
        return fechaA - fechaB;
    });

    // Crear libro y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos');

    // Definir columnas
    // Fecha | Hora | Usuario | Detalle | DineroInicial | I.DINERO | E.DINERO | S.DINERO | MaterialInicial | I.MATERIAL | E.MATERIAL | S.MATERIAL
    worksheet.columns = [
        { header: 'Fecha', key: 'Fecha', width: 15 },
        { header: 'Hora', key: 'Hora', width: 15 },
        { header: 'Usuario', key: 'Usuario', width: 20 },
        { header: 'Detalle', key: 'Detalle', width: 40 },
        { header: 'DineroInicial', key: 'DineroInicial', width: 15 },
        { header: 'I.DINERO', key: 'IDinero', width: 15 },
        { header: 'E.DINERO', key: 'EDinero', width: 15 },
        { header: 'S.DINERO', key: 'SDinero', width: 15 },
        { header: 'MaterialInicial', key: 'MaterialInicial', width: 15 },
        { header: 'I.MATERIAL', key: 'IMaterial', width: 15 },
        { header: 'E.MATERIAL', key: 'EMaterial', width: 15 },
        { header: 'S.MATERIAL', key: 'SMaterial', width: 15 }
    ];

    // Estilo de cabecera (Amarillo con bordes)
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' }
        };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        };
    });

    // Agregar filas
    movimientos.forEach(mov => {
        let row = {
            Fecha: mov.Fecha,
            Hora: mov.Hora,
            Usuario: mov.Usuario,
            Detalle: mov.Detalle,
            DineroInicial: '',
            IDinero: '',
            EDinero: '',
            SDinero: '',
            MaterialInicial: '',
            IMaterial: '',
            EMaterial: '',
            SMaterial: ''
        };

        if (mov.Tipo === "Capital") {
            let saldoFinal = parseFloat(mov.CapturaSaldo);
            let importe = parseFloat(mov.Importe);
            let saldoInicial = 0;

            if (mov.Operacion === "Aumentar") {
                saldoInicial = saldoFinal - importe;
                row.IDinero = importe;
            } else if (mov.Operacion === "Disminuir") {
                saldoInicial = saldoFinal + importe;
                row.EDinero = importe;
            }

            row.DineroInicial = saldoInicial;
            row.SDinero = saldoFinal;
        } else if (mov.Tipo === "Material") {
            let saldoFinal = parseFloat(mov.CapturaSaldo);
            let importe = parseFloat(mov.Importe);
            let saldoInicial = 0;

            if (mov.Operacion === "Aumentar") {
                saldoInicial = saldoFinal - importe;
                row.IMaterial = importe;
            } else if (mov.Operacion === "Disminuir") {
                saldoInicial = saldoFinal + importe;
                row.EMaterial = importe;
            }

            row.MaterialInicial = saldoInicial;
            row.SMaterial = saldoFinal;
        }

        worksheet.addRow(row);
    });

    // Aplicar estilos a las filas de datos
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Saltar la fila de encabezado
            row.eachCell((cell, colNumber) => {
                // Aplicar bordes a todas las celdas
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };

                // Columna I.DINERO (columna 6) - Azul
                if (colNumber === 6 && cell.value) {
                    cell.font = { color: { argb: '0000FF' } };
                }
                // Columna E.DINERO (columna 7) - Rojo
                if (colNumber === 7 && cell.value) {
                    cell.font = { color: { argb: 'FF0000' } };
                }
                // Columna S.DINERO (columna 8) - Fondo gris
                if (colNumber === 8) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D3D3D3' }
                    };
                }
                // Columna I.MATERIAL (columna 10) - Azul
                if (colNumber === 10 && cell.value) {
                    cell.font = { color: { argb: '0000FF' } };
                }
                // Columna E.MATERIAL (columna 11) - Rojo
                if (colNumber === 11 && cell.value) {
                    cell.font = { color: { argb: 'FF0000' } };
                }
                // Columna S.MATERIAL (columna 12) - Fondo gris
                if (colNumber === 12) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D3D3D3' }
                    };
                }
            });
        }
    });

    // Guardar archivo
    const filePath = path.join(app.getPath('desktop'), 'MovimientosEmpresariales.xlsx');

    try {
        await workbook.xlsx.writeFile(filePath);
        console.log(`✅ Excel generado: ${filePath}`);

        // Abrir archivo
        const command = process.platform === 'win32' ? `start "" "${filePath}"` : process.platform === 'darwin' ? `open "${filePath}"` : `xdg-open "${filePath}"`;
        exec(command, (err) => {
            if (err) {
                console.error("❌ Error al abrir el Excel:", err);
                event.sender.send("ModificarMensaje", {
                    tipo: "MensajeMalo",
                    texto: "Se generó el Excel pero no se pudo abrir automáticamente"
                });
            } else {
                console.log("📂 Excel abierto correctamente.");
                event.sender.send("ModificarMensaje", {
                    tipo: "MensajeBueno",
                    texto: "Excel exportado y abierto correctamente"
                });
            }
        });

    } catch (error) {
        console.error("❌ Error al guardar el Excel:", error);
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Error al guardar el archivo Excel"
        });
    }
});

// Evento -> aumentar capital economico
ipcMain.on("EAumentarCapitalEconomico", (event, monto) => {

    // mensaje de flujo
    console.log("Main: aumentando capital economico con monto: ", monto)

    // Paso -> aumentar capital
    let Respuesta = BDrespaldo.AumentarCapitalEconomico(monto)

    if (Respuesta.error == false) {
        // Paso -> obtener el capital actualizado
        let RespuestaCapital = BDrespaldo.ObtenerCapitalEconomicoEmpresarial()
        if (RespuestaCapital.error == false) {
            // Paso -> obtener usuario actual
            let usuarioActual = GestorSesion.obtenerUsuarioActual()

            // Paso -> obtener lista de capturas
            let RespuestaCapturas = BDrespaldo.ObtenerListaCapturas()
            let ListaCapturas = []
            if (RespuestaCapturas.error == false) {
                ListaCapturas = RespuestaCapturas.ListaCapturas
                // Ordenar por fecha de más reciente a más antigua
                ListaCapturas.sort((a, b) => {
                    let fechaA = new Date(a.Fecha);
                    let fechaB = new Date(b.Fecha);
                    return fechaA - fechaB;
                });
            }

            // Paso -> enviar evento para actualizar tabla diaria
            event.sender.send("EActualizarTablaDiaria", {
                "diarios": ListaCapturas,
                "CapitalEconomico": RespuestaCapital.CapitalEconomico,
                "CapitalMaterial": BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
                "fecha": ObtenerFecha()
            })

            // Paso -> enviar mensaje de exito
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El capital económico se aumentó correctamente"
            })
            // Paso -> actualizar la vista
            event.sender.send("EActualizarCapitales", {
                CapitalEconomico: RespuestaCapital.CapitalEconomico,
                CapitalMaterial: BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
                rolUsuario: usuarioActual ? usuarioActual.Rol : "Cajero"
            })
        }
    } else {
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo aumentar el capital económico"
        })
    }
})

// Evento -> disminuir capital economico
ipcMain.on("EDisminuirCapitalEconomico", (event, monto) => {

    // mensaje de flujo
    console.log("Main: disminuyendo capital economico con monto: ", monto)

    // Paso -> disminuir capital
    let Respuesta = BDrespaldo.DisminuirCapitalEconomico(monto)

    if (Respuesta.error == false) {
        // Paso -> obtener el capital actualizado
        let RespuestaCapital = BDrespaldo.ObtenerCapitalEconomicoEmpresarial()
        if (RespuestaCapital.error == false) {
            // Paso -> obtener usuario actual
            let usuarioActual = GestorSesion.obtenerUsuarioActual()

            // Paso -> obtener lista de capturas
            let RespuestaCapturas = BDrespaldo.ObtenerListaCapturas()
            let ListaCapturas = []
            if (RespuestaCapturas.error == false) {
                ListaCapturas = RespuestaCapturas.ListaCapturas
                // Ordenar por fecha de más reciente a más antigua
                ListaCapturas.sort((a, b) => {
                    let fechaA = new Date(a.Fecha);
                    let fechaB = new Date(b.Fecha);
                    return fechaA - fechaB;
                });
            }

            // Paso -> enviar evento para actualizar tabla diaria
            event.sender.send("EActualizarTablaDiaria", {
                "diarios": ListaCapturas,
                "CapitalEconomico": RespuestaCapital.CapitalEconomico,
                "CapitalMaterial": BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
                "fecha": ObtenerFecha()
            })

            // Paso -> enviar mensaje de exito
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El capital económico se disminuyó correctamente"
            })
            // Paso -> actualizar la vista
            event.sender.send("EActualizarCapitales", {
                CapitalEconomico: RespuestaCapital.CapitalEconomico,
                CapitalMaterial: BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
                rolUsuario: usuarioActual ? usuarioActual.Rol : "Cajero"
            })
        }
    } else {
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo disminuir el capital económico"
        })
    }
})

// Evento -> aumentar capital material
ipcMain.on("EAumentarCapitalMaterial", (event, monto) => {

    // mensaje de flujo
    console.log("Main: aumentando capital material con monto: ", monto)

    // Paso -> aumentar capital
    let Respuesta = BDrespaldo.AumentarCapitalMaterial(monto)

    if (Respuesta.error == false) {
        // Paso -> obtener el capital actualizado
        let RespuestaCapital = BDrespaldo.ObtenerCapitalMaterialEmpresarial()
        if (RespuestaCapital.error == false) {
            // Paso -> obtener usuario actual
            let usuarioActual = GestorSesion.obtenerUsuarioActual()

            // Paso -> obtener lista de capturas
            let RespuestaCapturas = BDrespaldo.ObtenerListaCapturas()
            let ListaCapturas = []
            if (RespuestaCapturas.error == false) {
                ListaCapturas = RespuestaCapturas.ListaCapturas
                // Ordenar por fecha de más reciente a más antigua
                ListaCapturas.sort((a, b) => {
                    let fechaA = new Date(a.Fecha);
                    let fechaB = new Date(b.Fecha);
                    return fechaA - fechaB;
                });
            }

            // Paso -> enviar evento para actualizar tabla diaria
            event.sender.send("EActualizarTablaDiaria", {
                "diarios": ListaCapturas,
                "CapitalEconomico": BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
                "CapitalMaterial": RespuestaCapital.CapitalMaterial,
                "fecha": ObtenerFecha()
            })

            // Paso -> enviar mensaje de exito
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El capital material se aumentó correctamente"
            })
            // Paso -> actualizar la vista
            event.sender.send("EActualizarCapitales", {
                CapitalEconomico: BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
                CapitalMaterial: RespuestaCapital.CapitalMaterial,
                rolUsuario: usuarioActual ? usuarioActual.Rol : "Cajero"
            })
        }
    } else {
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo aumentar el capital material"
        })
    }
})

// Evento -> disminuir capital material
ipcMain.on("EDisminuirCapitalMaterial", (event, monto) => {

    // mensaje de flujo
    console.log("Main: disminuyendo capital material con monto: ", monto)

    // Paso -> disminuir capital
    let Respuesta = BDrespaldo.DisminuirCapitalMaterial(monto)

    if (Respuesta.error == false) {
        // Paso -> obtener el capital actualizado
        let RespuestaCapital = BDrespaldo.ObtenerCapitalMaterialEmpresarial()
        if (RespuestaCapital.error == false) {
            // Paso -> obtener usuario actual
            let usuarioActual = GestorSesion.obtenerUsuarioActual()

            // Paso -> obtener lista de capturas
            let RespuestaCapturas = BDrespaldo.ObtenerListaCapturas()
            let ListaCapturas = []
            if (RespuestaCapturas.error == false) {
                ListaCapturas = RespuestaCapturas.ListaCapturas
                // Ordenar por fecha de más reciente a más antigua
                ListaCapturas.sort((a, b) => {
                    let fechaA = new Date(a.Fecha);
                    let fechaB = new Date(b.Fecha);
                    return fechaA - fechaB;
                });
            }

            // Paso -> enviar evento para actualizar tabla diaria
            event.sender.send("EActualizarTablaDiaria", {
                "diarios": ListaCapturas,
                "CapitalEconomico": BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
                "CapitalMaterial": RespuestaCapital.CapitalMaterial,
                "fecha": ObtenerFecha()
            })

            // Paso -> enviar mensaje de exito
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: "El capital material se disminuyó correctamente"
            })
            // Paso -> actualizar la vista
            event.sender.send("EActualizarCapitales", {
                CapitalEconomico: BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
                CapitalMaterial: RespuestaCapital.CapitalMaterial,
                rolUsuario: usuarioActual ? usuarioActual.Rol : "Cajero"
            })
        }
    } else {
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo disminuir el capital material"
        })
    }
})

// Evento -> abrir popup para ingresar monto
ipcMain.on("EQuiereIngresarMonto", (event, datos) => {

    // mensaje de flujo
    console.log("Main: abriendo popup para ingresar monto")
    console.log("Main: tipo de operación:", datos.tipo)

    // Paso -> crear ventana popup
    InputMontoWindow = new BrowserWindow({
        width: 450,
        height: 450,
        resizable: false,
        modal: true,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    InputMontoWindow.loadFile("./src/componentes/InputMontoWindow.html")
    InputMontoWindow.removeMenu();

    // Paso -> enviar tipo de operación al popup
    InputMontoWindow.webContents.on('did-finish-load', () => {
        InputMontoWindow.webContents.send("EInicializarInputMontoWindow", datos)
    })
})

// Evento -> recibir monto ingresado desde popup
ipcMain.on("EMontoIngresado", (event, datos) => {

    // mensaje de flujo
    console.log("Main: monto ingresado desde popup")
    console.log("Main: monto:", datos.monto)
    console.log("Main: detalle:", datos.detalle)
    console.log("Main: tipo:", datos.tipo)

    // Paso -> cerrar popup
    if (InputMontoWindow) {
        InputMontoWindow.close()
        InputMontoWindow = null
    }

    let usuarioActual = GestorSesion.obtenerUsuarioActual()
    let nombreUsuario = usuarioActual ? usuarioActual.Nombres : "Desconocido"
    let respuestaOperacion = { error: true }
    let nuevoSaldo = 0
    let tipoCapital = ""
    let operacion = ""
    let mensajeExito = ""

    // Paso -> ejecutar la operación correspondiente
    switch (datos.tipo) {
        case "aumentarEconomico":
            respuestaOperacion = BDrespaldo.AumentarCapitalEconomico(datos.monto)
            if (respuestaOperacion.error == false) {
                let respCapital = BDrespaldo.ObtenerCapitalEconomicoEmpresarial()
                nuevoSaldo = respCapital.CapitalEconomico
                tipoCapital = "Capital"
                operacion = "Aumentar"
                mensajeExito = "El capital económico se aumentó correctamente"
            }
            break;
        case "disminuirEconomico":
            respuestaOperacion = BDrespaldo.DisminuirCapitalEconomico(datos.monto)
            if (respuestaOperacion.error == false) {
                let respCapital = BDrespaldo.ObtenerCapitalEconomicoEmpresarial()
                nuevoSaldo = respCapital.CapitalEconomico
                tipoCapital = "Capital"
                operacion = "Disminuir"
                mensajeExito = "El capital económico se disminuyó correctamente"
            }
            break;
        case "aumentarMaterial":
            respuestaOperacion = BDrespaldo.AumentarCapitalMaterial(datos.monto)
            if (respuestaOperacion.error == false) {
                let respCapital = BDrespaldo.ObtenerCapitalMaterialEmpresarial()
                nuevoSaldo = respCapital.CapitalMaterial
                tipoCapital = "Material"
                operacion = "Aumentar"
                mensajeExito = "El capital material se aumentó correctamente"
            }
            break;
        case "disminuirMaterial":
            respuestaOperacion = BDrespaldo.DisminuirCapitalMaterial(datos.monto)
            if (respuestaOperacion.error == false) {
                let respCapital = BDrespaldo.ObtenerCapitalMaterialEmpresarial()
                nuevoSaldo = respCapital.CapitalMaterial
                tipoCapital = "Material"
                operacion = "Disminuir"
                mensajeExito = "El capital material se disminuyó correctamente"
            }
            break;
    }

    if (respuestaOperacion.error == false) {
        // Actualizar UI
        mainWindow.webContents.send("ModificarMensaje", {
            tipo: "MensajeBueno",
            texto: mensajeExito
        })
        // Paso -> obtener lista de capturas
        let RespuestaCapturas = BDrespaldo.ObtenerListaCapturas()
        let ListaCapturas = []
        if (RespuestaCapturas.error == false) {
            ListaCapturas = RespuestaCapturas.ListaCapturas
            // Ordenar por fecha de más reciente a más antigua
            ListaCapturas.sort((a, b) => {
                let fechaA = new Date(a.Fecha);
                let fechaB = new Date(b.Fecha);
                return fechaA - fechaB;
            });
        }

        // Paso -> enviar evento para actualizar tabla diaria
        mainWindow.webContents.send("EActualizarTablaDiaria", {
            "diarios": ListaCapturas,
            "CapitalEconomico": BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
            "CapitalMaterial": BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
            "fecha": ObtenerFecha()
        })

        mainWindow.webContents.send("EActualizarCapitales", {
            CapitalEconomico: BDrespaldo.ObtenerCapitalEconomicoEmpresarial().CapitalEconomico,
            CapitalMaterial: BDrespaldo.ObtenerCapitalMaterialEmpresarial().CapitalMaterial,
            rolUsuario: usuarioActual ? usuarioActual.Rol : "Cajero"
        })

        // Registrar movimiento empresarial
        let movimiento = {
            Tipo: tipoCapital,
            Operacion: operacion,
            Fecha: ObtenerFecha(),
            Usuario: nombreUsuario,
            Importe: datos.monto,
            Detalle: datos.detalle,
            Hora: ObtenerHora(),
            CapturaSaldo: nuevoSaldo
        }
        MovimientoEmpresarial.GuardarMovimiento(movimiento)
        console.log("Main: Movimiento empresarial registrado:", movimiento)

    } else {
        mainWindow.webContents.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "No se pudo realizar la operación"
        })
    }
})

// Evento -> cancelar ingreso de monto
ipcMain.on("ECancelarIngresoMonto", (event) => {
    console.log("Main: cancelando ingreso de monto")
    if (InputMontoWindow) {
        InputMontoWindow.close()
        InputMontoWindow = null
    }
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

// Evento -> mostrar estado de cuenta
ipcMain.on("EQuiereMostrarEstadoDeCuenta", (event, datos) => {

    console.log("Main: se llamó al evento EQuiereMostrarEstadoDeCuenta");

    // Aquí tienes los datos del cliente/usuario/elemento
    console.log("Datos recibidos:", datos);

    listaMovimientosTodos = BDrespaldo.ObtenerMovimientoMaterialEconomico(datos.FechaIngreso, ObtenerFecha(), datos.ID)
    let pasarDatos = {
        Cliente: datos,
        Movimientos: listaMovimientosTodos.ListaCombinadaResultante
    }

    // Paso -> enviar los clientes obtenidos para ser mostrados en la tabla
    event.sender.send("CargarEstadoDeCuenta", pasarDatos)
});


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
        cancelId: 0,
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
    console.log(`Main: el cliente que se buscarÃ¡ es: ${dato}`);

    // Obtener la lista de clientes
    let Respuesta = BDrespaldo.ObtenerTablaClientes()
    // ExpresiÃ³n regular para buscar en cualquier parte del nombre o apellido (sin distinguir mayÃºsculas/minÃºsculas)
    let regex = new RegExp(dato, "i");
    // Filtrar clientes que coincidan con la bÃºsqueda en nombre o apellido
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

    let datosAGuardar = Movimiento;
    let filtro = null;

    if (Movimiento.filtro) {
        datosAGuardar = Movimiento.movimiento;
        filtro = Movimiento.filtro;
    }

    // Paso -> asignar la hora
    datosAGuardar.Hora = ObtenerHora()

    // Paso -> guarda en la base de datos el movimiento
    let Respuesta = BDrespaldo.GuardarMovimientoRespaldo(datosAGuardar)

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
        let Respuesta;
        if (filtro) {
            Respuesta = BDrespaldo.AplicarFiltros(filtro.cliente, filtro.fechaInicio, filtro.fechaFinal)
        } else {
            let fecha = ObtenerFecha()
            Respuesta = BDrespaldo.ObtenerTablaMovimientos(fecha, fecha)
        }

        if (Respuesta.error == false) {
            // Paso -> actualizar tabla
            // Manejar posible inconsistencia de nombres en BDrespaldo
            let lista = Respuesta.ListaMovimientosEconomicos || Respuesta.ListaMovimentosEconomicos;
            event.sender.send("ActualizarTablaMovimientos", lista)
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

    let datosAEliminar = Movimiento;
    let filtro = null;

    if (Movimiento.filtro) {
        datosAEliminar = Movimiento.movimiento;
        filtro = Movimiento.filtro;
    }

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        cancelId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar el movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        console.log("Main: la decision fue confirmada");

        let Respuesta = BDrespaldo.EliminarMovimiento(datosAEliminar.ID)
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
            let Respuesta;
            if (filtro) {
                Respuesta = BDrespaldo.AplicarFiltros(filtro.cliente, filtro.fechaInicio, filtro.fechaFinal)
            } else {
                let fecha = ObtenerFecha()
                Respuesta = BDrespaldo.ObtenerTablaMovimientos(fecha, fecha)
            }

            if (Respuesta.error == false) {
                // Paso -> actualizar tabla
                let lista = Respuesta.ListaMovimientosEconomicos || Respuesta.ListaMovimentosEconomicos;
                event.sender.send("ActualizarTablaMovimientos", lista)
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
        cancelId: 0,
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
        cancelId: 0,
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
        cancelId: 0,
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

    console.log("MENSAJE: estos son los datos que se descargarÃ¡n de la tabla:");
    console.log(movimientos);

    const carpetaDescargas = app.getPath("downloads");
    let nombreArchivo = "movimientos.xlsx";
    let rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
    let contador = 1;

    while (fs.existsSync(rutaArchivo)) {
        nombreArchivo = `movimientos (${contador}).xlsx`;
        rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
        contador++;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Movimientos");

        // ================================
        // NUEVAS COLUMNAS PEDIDAS
        // ================================
        worksheet.columns = [
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Cliente", key: "ClienteNombres", width: 20 },
            { header: "Usuario", key: "UsuarioNombres", width: 20 },
            { header: "ObservaciÃ³n", key: "Observacion", width: 30 },

            // DINERO
            { header: "I.DINERO", key: "I_DINERO", width: 15 },
            { header: "E.DINERO", key: "E_DINERO", width: 15 },
            { header: "S.DINERO", key: "S_DINERO", width: 15 },

            // MATERIAL
            { header: "I.MATERIAL", key: "I_MATERIAL", width: 15 },
            { header: "E.MATERIAL", key: "E_MATERIAL", width: 15 },
            { header: "S.MATERIAL", key: "S_MATERIAL", width: 15 }
        ];

        // =====================================
        // TRANSFORMAR MOVIMIENTOS SEGÃšN REGISTRO
        // =====================================
        movimientos.forEach(mov => {

            let row = {
                Fecha: mov.Fecha,
                Hora: mov.Hora,
                ClienteNombres: mov.ClienteNombres,
                UsuarioNombres: mov.UsuarioNombres,
                Observacion: mov.Observacion,

                // Todas las columnas en 0 por defecto
                I_DINERO: 0,
                E_DINERO: 0,
                S_DINERO: 0,

                I_MATERIAL: 0,
                E_MATERIAL: 0,
                S_MATERIAL: 0
            };

            const importe = parseFloat(mov.Importe);
            const saldo = parseFloat(mov.CapturaSaldo);

            const esMaterial = mov.Registro === "Material";
            const esEconomico = mov.Registro === "Economico";

            // =============================
            // ELEGIR COLUMNA SEGÃšN REGISTRO
            // =============================
            if (esEconomico) {

                if (mov.Tipo === "Ingreso") row.I_DINERO = importe;
                if (mov.Tipo === "Retiro") row.E_DINERO = importe;

                row.S_DINERO = saldo;

            } else if (esMaterial) {

                if (mov.Tipo === "Ingreso") row.I_MATERIAL = importe;
                if (mov.Tipo === "Retiro") row.E_MATERIAL = importe;

                row.S_MATERIAL = saldo;
            }

            worksheet.addRow(row);
        });

        // Encabezados (amarillo)
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
            cell.alignment = { horizontal: "center" };
        });

        // Colorear nÃºmeros positivos/negativos
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {

                // columnas numÃ©ricas (todas)
                for (let col = 6; col <= 11; col++) {
                    const cell = row.getCell(col);
                    const val = Number(cell.value);

                    if (val > 0) cell.font = { color: { argb: "0000FF" } };
                    else if (val < 0) cell.font = { color: { argb: "FF0000" } };

                    cell.alignment = { horizontal: "right" };
                }
            }
        });

        workbook.xlsx.writeFile(rutaArchivo)
            .then(() => {
                shell.openPath(rutaArchivo);

                event.sender.send("ModificarMensaje", {
                    tipo: "MensajeBueno",
                    texto: `El Excel se descargÃ³ con Ã©xito: ${rutaArchivo}`
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
        cancelId: 0,
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

        // Aquí puedes agregar la lÃ³gica para eliminar el cliente del archivo o la base de datos
    } else {
        console.log("La eliminaciÃ³n del usuario ha sido cancelada.");
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
    console.log(`MENSAJE: el usuario que se buscarÃ¡ es: ${dato}`);

    // Obtener la lista de clientes
    let usuarios = BDrespaldo.ObtenerTablaUsuarios();

    // ExpresiÃ³n regular para buscar en cualquier parte del nombre o apellido (sin distinguir mayÃºsculas/minÃºsculas)
    let regex = new RegExp(dato, "i");

    // Filtrar clientes que coincidan con la bÃºsqueda en nombre o apellido
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

    let datosAGuardar = Movimiento;
    let filtro = null;

    if (Movimiento.filtro) {
        datosAGuardar = Movimiento.movimiento;
        filtro = Movimiento.filtro;
    }

    // Paso -> asignar la hora
    datosAGuardar.Hora = ObtenerHora()

    // Paso -> guarda en la base de datos el movimiento
    let Respuesta = BDrespaldo.GuardarMovimientoMaterial(datosAGuardar)

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
        let Respuesta;
        if (filtro) {
            Respuesta = BDrespaldo.FiltrarMovimientosMateriales(filtro.cliente, filtro.fechaInicio, filtro.fechaFinal)
        } else {
            let fecha = ObtenerFecha()
            Respuesta = BDrespaldo.ObtenerTablaMovimientosMateriales(fecha, fecha)
        }

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

    let datosAEliminar = Movimiento;
    let filtro = null;

    if (Movimiento.filtro) {
        datosAEliminar = Movimiento.movimiento;
        filtro = Movimiento.filtro;
    }

    // Paso -> mostrar la ventana de confirmacion
    const opciones = {
        type: "question",
        buttons: ["Cancelar", "Aceptar"],
        defaultId: 0,
        cancelId: 0,
        title: "Confirmación",
        message: `¿Estás seguro de que deseas eliminar el movimiento?`,
    };
    const respuesta = dialog.showMessageBoxSync(null, opciones);

    if (respuesta === 1) {
        console.log("Main: la decision fue confirmada");

        let Respuesta = BDrespaldo.EliminarMovimientoMaterial(datosAEliminar.ID)
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
            let Respuesta;
            if (filtro) {
                Respuesta = BDrespaldo.FiltrarMovimientosMateriales(filtro.cliente, filtro.fechaInicio, filtro.fechaFinal)
            } else {
                let fecha = ObtenerFecha()
                Respuesta = BDrespaldo.ObtenerTablaMovimientosMateriales(fecha, fecha)
            }

            if (Respuesta.error == false) {
                // Paso -> actualizar tabla
                event.sender.send("ActualizarTablaMovimientosMateriales", Respuesta.ListaMovimientosMateriales)
            }
        }
    } else {
        console.log("Main: no se confirmo la decision");
    }
})



// Evento -> ver detalles del día
ipcMain.on('EQuiereVerDetallesDia', (event, datos) => {
    console.log('Main: se llamó al evento ver detalles del día');
    console.log('Main: fecha:', datos.fecha);

    // 1. Obtener movimientos económicos, materiales y ventas ocasionales
    let Respuesta = BDrespaldo.ObtenerMovimientoMaterialEconomico(datos.fecha, datos.fecha, null);

    // 2. Obtener movimientos empresariales
    let RespuestaEmpresariales = MovimientoEmpresarial.ObtenerMovimientos();
    let movimientosEmpresarialesFiltrados = [];

    if (RespuestaEmpresariales.error === false) {
        // Filtrar por fecha (asumiendo que tienen propiedad Fecha)
        movimientosEmpresarialesFiltrados = RespuestaEmpresariales.Elementos.filter(m => m.Fecha === datos.fecha);

        // Ordenar por Hora Descendente (ya que la fecha es la misma)
        movimientosEmpresarialesFiltrados.sort((a, b) => {
            if (a.Hora > b.Hora) return -1;
            if (a.Hora < b.Hora) return 1;
            return 0;
        });
    }

    if (Respuesta.error === false) {
        let datosDetalles = {
            fecha: datos.fecha,
            movimientos: Respuesta.ListaCombinadaResultante || [],
            movimientosEmpresariales: movimientosEmpresarialesFiltrados || []
        };
        console.log('Main: Se encontraron ' + datosDetalles.movimientos.length + ' movimientos generales');
        console.log('Main: Se encontraron ' + datosDetalles.movimientosEmpresariales.length + ' movimientos empresariales');
        event.sender.send('EMostrarDetallesDia', datosDetalles);
    } else {
        console.error('Main: Error al obtener los movimientos');
        event.sender.send('EMostrarDetallesDia', {
            fecha: datos.fecha,
            movimientos: [],
            movimientosEmpresariales: []
        });
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});



// Evento -> Exportar Detalles del Día a Excel
ipcMain.on("EExportarDetallesDia", (event, datos) => {
    console.log("Main: Exportando detalles del día a Excel", datos.fecha);

    const carpetaDescargas = app.getPath("downloads");
    let nombreArchivo = `Reporte_Diario_${datos.fecha}.xlsx`;
    let rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
    let contador = 1;

    while (fs.existsSync(rutaArchivo)) {
        nombreArchivo = `Reporte_Diario_${datos.fecha} (${contador}).xlsx`;
        rutaArchivo = path.join(carpetaDescargas, nombreArchivo);
        contador++;
    }

    try {
        const workbook = new ExcelJS.Workbook();

        // Estilo para encabezados
        const headerStyle = (cell) => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
            cell.alignment = { horizontal: "center" };
        };

        // Función helper para crear hojas
        const crearHoja = (nombre, columnas, data) => {
            if (!data || data.length === 0) return;
            const ws = workbook.addWorksheet(nombre);
            ws.columns = columnas;

            data.forEach(item => {
                ws.addRow(item);
            });

            ws.getRow(1).eachCell(headerStyle);
        };

        // 1. Movimientos Económicos
        const movEconomicos = datos.movimientos.filter(m => m.Registro === "Economico");
        console.log("Exportar Excel: Encontrados " + movEconomicos.length + " movimientos económicos");

        crearHoja("Economicos", [
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Tipo", key: "Tipo", width: 15 },
            { header: "Cliente", key: "ClienteNombres", width: 30 }, // Usando ClienteNombres o ClienteN
            { header: "Importe", key: "Importe", width: 15 },
            { header: "Observación", key: "Observacion", width: 40 }
        ], movEconomicos.map(m => ({
            ...m,
            ClienteNombres: m.ClienteN || m.ClienteNombres, // Normalizar
            Importe: parseFloat(m.Importe || 0) // Asegurar que sea número
        })));

        // 2. Movimientos Materiales
        const movMateriales = datos.movimientos.filter(m => m.Registro === "Material");
        console.log("Exportar Excel: Encontrados " + movMateriales.length + " movimientos materiales");

        crearHoja("Materiales", [
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Tipo", key: "Tipo", width: 15 },
            { header: "Cliente", key: "ClienteNombres", width: 30 },
            { header: "Peso", key: "Peso", width: 15 },
            { header: "Observación", key: "Observacion", width: 40 }
        ], movMateriales.map(m => ({
            ...m,
            ClienteNombres: m.ClienteN || m.ClienteNombres,
            Peso: (m.Peso || '0') + ' g.' // Formato "0 g."
        })));

        // 3. Ventas Ocasionales
        const ventasOcasionales = datos.movimientos.filter(m => m.Registro === "VentaOcasional");
        console.log("Exportar Excel: Encontrados " + ventasOcasionales.length + " ventas ocasionales");

        crearHoja("Ventas Ocasionales", [
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Tipo", key: "Tipo", width: 15 },
            { header: "Cliente", key: "Cliente", width: 30 },
            { header: "Peso", key: "Peso", width: 15 },
            { header: "Importe", key: "Importe", width: 15 }
        ], ventasOcasionales.map(m => ({
            ...m,
            Cliente: m.ClienteN || m.ClienteNombres || m.Cliente,
            Peso: (m.Peso || '0') + ' g.', // Formato "0 g."
            Importe: parseFloat(m.Importe || 0)
        })));

        // 4. Movimientos Empresariales
        const movEmpresariales = datos.movimientosEmpresariales || [];
        console.log("Exportar Excel: Encontrados " + movEmpresariales.length + " movimientos empresariales");

        crearHoja("Empresariales", [
            { header: "ID", key: "ID", width: 10 },
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Hora", key: "Hora", width: 10 },
            { header: "Usuario", key: "Usuario", width: 20 },
            { header: "Tipo", key: "Tipo", width: 15 },
            { header: "Operación", key: "Operacion", width: 15 },
            { header: "Importe", key: "Importe", width: 15 },
            { header: "Detalle", key: "Detalle", width: 30 },
            { header: "Saldo", key: "CapturaSaldo", width: 15 }
        ], movEmpresariales);

        workbook.xlsx.writeFile(rutaArchivo).then(() => {
            shell.openPath(rutaArchivo);
            event.sender.send("ModificarMensaje", {
                tipo: "MensajeBueno",
                texto: `Reporte generado: ${nombreArchivo}`
            });
        });

    } catch (error) {
        console.error("Error generando Excel:", error);
        event.sender.send("ModificarMensaje", {
            tipo: "MensajeMalo",
            texto: "Error al generar el reporte Excel"
        });
    }
});

