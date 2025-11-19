// Variables

    // codigo
    let codigo = ``

// Funciones

    // Funcion -> cargar el componente mensaje
    function CargarMensajeUsuarios (mensaje){

        // mansaje de flujo
        console.log("MENSAJE: cargaremos el componente mensaje")

        // Paso -> obtener el espacio del mensaje
        let EspacioMensajeUsuario = document.getElementById("EspacioMensajeUsuario")
        if(EspacioMensajeUsuario){// se encontro el espacio

            // Paso -> modificar el codigo 
            codigo = `
                <div class="Mensaje ${mensaje.tipo}">
                    <p class="mensaje">${mensaje.texto}</p>
                </div>
            `
            // Paso -> ingresar el codigo html
            EspacioMensajeUsuario.innerHTML = codigo

        }else{// no se encontro el espacio
            console.log("ERROR: no se pudo obtener el espacio donde colocar el componente mensaje usuario")
        }

    }
    
module.exports = { CargarMensajeUsuarios };