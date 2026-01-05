// Variables

// codigo
let codigo = ``

// Funciones

// Funcion -> cargar el componente mensaje
function CargarMensajeCuentaEmpresarial(mensaje) {

    // mansaje de flujo
    console.log("MENSAJE: cargaremos el componente mensaje en Cuenta Empresarial")

    // Paso -> obtener el espacio del mensaje
    let EspacioMensaje = document.getElementById("EspacioMensajeCuentaEmpresarial")
    if (EspacioMensaje) {// se encontro el espacio

        // Paso -> modificar el codigo 
        codigo = `
                <div class="Mensaje ${mensaje.tipo}">
                    <p class="mensaje">${mensaje.texto}</p>
                </div>
            `
        // Paso -> ingresar el codigo html
        EspacioMensaje.innerHTML = codigo

    } else {// no se encontro el espacio
        console.log("ERROR: no se pudo obtener el espacio donde colocar el componente mensaje en Cuenta Empresarial")
    }

}

module.exports = { CargarMensajeCuentaEmpresarial };
