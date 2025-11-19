const { ipcRenderer } = require("electron");

// Variables

// Funciones

    // Funcion1 -> Informar sobre la seleccioin de salir del software
    function CerrarSesion (){
        // Paso -> enviar evento
        ipcRenderer.send("ECerrarSesion")
    }

    // Funcion2 -> cambiar contenido de acuerdo a la seleccion de la opcion
    function CambiarContenido (event,datos){

        console.log(datos)

        // Paso -> obtener las propiedades del boton en el que se hizo click
        let boton = event.target

        // Paso -> obtener el atributo opcion para ver cual fue seleccionado
        let opcion = boton.getAttribute("Opcion");
        console.log("Opción seleccionada:", opcion);

        let nuevosDatos = {
            "usuarioIngresado":datos.usuarioIngresado,
            "pantalla": opcion
        }

        // Paso -> remover la clase "active" del botón previamente seleccionado
        let botonActivo = document.querySelector(".menu-item.active");
        if (botonActivo) {botonActivo.classList.remove("active");}

        // Paso -> agregar la clase "active" al nuevo botón seleccionado
        boton.classList.add("active");

        // Paso -> enviar evento al proceso principal
        ipcRenderer.send("menu-seleccionado", nuevosDatos);
    }

    // Funcion3 -> mostrar o renderizar el menu
    function MostrarMenu(datos) {

        let EspacioMenu = document.getElementById("EspacioMenu");
        if (EspacioMenu) {

            // Paso -> obtener el espacio donde se colocara el menu
            let codigo = `
                <div class="Empresa">
                    <h1>REDSUR</h1>
                    <p>Bienvenido: ${datos.usuarioIngresado.Nombres}</p>
                </div>
                <div class="Opciones">
                    <button Opcion="CuentaEmpresarial" class="menu-item active">Cuenta Empresarial</button>
                    <button Opcion="VentasOcasional" class="menu-item">Venta Ocasional</button>
                    <button Opcion="MovimientoMaterial" class="menu-item">Movimiento - Material</button>
                    <button Opcion="VerMovimientos" class="menu-item">Movimiento - Economico</button>
                    <button Opcion="VerClientes" class="menu-item">Clientes</button>
                    <button Opcion="VerUsuarios" class="menu-item">Usuarios</button>
                </div>
                <div class="Botones">
                    <button class="exit-button">Salir</button>
                </div>
            `;

            EspacioMenu.innerHTML = codigo;

            // Paso -> agregar evento al botón "Salir"
            let exitButton = EspacioMenu.querySelector(".exit-button");
            if (exitButton) {exitButton.addEventListener("click", CerrarSesion);}

            // Paso -> agregar eventos a los botones del menú
            let botones = EspacioMenu.querySelectorAll(".Opciones .menu-item");
            botones.forEach((boton)=>{boton.addEventListener("click",()=>{CambiarContenido(event,datos)})});
        }
    }

module.exports = { MostrarMenu };