const { ipcRenderer } = require("electron");

// Funciones

// Evento -> escuchar el evento desde `main.js` y actualizar contenido
ipcRenderer.on("InicializarLogin", (event, empleados) => {

    // mensaje de flujo
    console.log("MENSAJE: llegaron estos empleados: ");
    console.log(empleados);

    // Paso -> obtener el espacio para mapear los empleados
    let EspacioEmpleado = document.getElementById("cargo");

    // Limpiar opciones previas (opcional)
    EspacioEmpleado.innerHTML = "<option value=''>Seleccione un cargo</option>";

    // Insertar opciones de empleados
    empleados.forEach(empleado => {
        let option = document.createElement("option");
        option.value = empleado.ID;
        option.textContent = empleado.Nombres;
        EspacioEmpleado.appendChild(option);
    });
});

// Evento -> escuchar error de login
// Evento -> escuchar error de login
ipcRenderer.on("LoginFallido", (event, mensaje) => {
    let mensajeError = document.getElementById("mensaje-error");
    if (mensajeError) {
        mensajeError.textContent = mensaje;
    }
});

// Capturar el formulario y procesar el inicio de sesión
document.querySelector(".login-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío del formulario

    // Limpiar mensaje de error previo
    let mensajeError = document.getElementById("mensaje-error");
    if (mensajeError) {
        mensajeError.textContent = "";
    }

    // Obtener los valores seleccionados
    let empleadoSeleccionado = document.getElementById("cargo").value;
    let claveIngresada = document.getElementById("clave").value;

    // Crear el objeto empleado
    let empleado = {
        ID: empleadoSeleccionado,
        Contrasena: claveIngresada
    };

    // Imprimir en consola
    console.log("Empleado ingresado:", empleado);

    // Enviar en evento
    ipcRenderer.send("EAutenticarUsuario", empleado)
});
