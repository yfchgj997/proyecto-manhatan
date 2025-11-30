const { ipcRenderer } = require("electron");

// Funcion1 -> Informar sobre la seleccioin de salir del software
function CerrarSesion() {
    // Paso -> enviar evento
    ipcRenderer.send("ECerrarSesion")
}

// Funcion2 -> cambiar contenido de acuerdo a la seleccion de la opcion
function CambiarContenido(event, datos) {

    console.log(datos)

    // Paso -> obtener las propiedades del boton en el que se hizo click
    let boton = event.target

    // Paso -> obtener el atributo opcion para ver cual fue seleccionado
    let opcion = boton.getAttribute("Opcion");
    console.log("Opción seleccionada:", opcion);

    let nuevosDatos = {
        "usuarioIngresado": datos.usuarioIngresado,
        "pantalla": opcion
    }

    // Paso -> remover la clase "active" del botón previamente seleccionado
    let botonActivo = document.querySelector(".menu-item.active");
    if (botonActivo) { botonActivo.classList.remove("active"); }

    // Paso -> agregar la clase "active" al nuevo botón seleccionado
    boton.classList.add("active");

    // Paso -> enviar evento al proceso principal
    ipcRenderer.send("menu-seleccionado", nuevosDatos);
}

// Funcion3 -> mostrar o renderizar el menu
function MostrarMenu(datos) {

    let EspacioMenu = document.getElementById("EspacioMenu");
    if (EspacioMenu) {

        // Paso -> Obtener el rol del usuario y sus privilegios
        const rol = datos.usuarioIngresado.Rol;
        const privilegios = datos.privilegios || {};

        // Paso -> Verificar privilegios para cada módulo usando los privilegios recibidos
        const puedeVerUsuarios = privilegios.usuarios?.ver || false;
        const puedeVerClientes = privilegios.clientes?.ver || false;
        const puedeVerMovimientos = privilegios.movimientosEconomicos?.ver || false;
        const puedeVerMovimientosMateriales = privilegios.movimientosMateriales?.ver || false;
        const puedeVerCompraVenta = privilegios.compraVenta?.ver || false;
        const puedeVerCuentaEmpresarial = privilegios.cuentaEmpresarial?.ver || false;

        // Paso -> obtener el espacio donde se colocara el menu
        let codigo = `
                <div class="Empresa">
                    <h1>Inv.DUBAI</h1>
                    <p>Bienvenido: ${datos.usuarioIngresado.Nombres}</p>
                    <p style="font-size: 1.1em; color: #f4ececff;">Rol: ${rol}</p>
                </div>
                <div class="Opciones">
                    ${puedeVerCuentaEmpresarial ? '<button Opcion="CuentaEmpresarial" class="menu-item active">Cuenta Empresarial</button>' : ''}
                    ${puedeVerCompraVenta ? '<button Opcion="VentasOcasional" class="menu-item">Venta Ocasional</button>' : ''}
                    ${puedeVerMovimientosMateriales ? '<button Opcion="MovimientoMaterial" class="menu-item">Movimiento - Material</button>' : ''}
                    ${puedeVerMovimientos ? '<button Opcion="VerMovimientos" class="menu-item">Movimiento - Economico</button>' : ''}
                    ${puedeVerClientes ? '<button Opcion="VerClientes" class="menu-item">Clientes</button>' : ''}
                    ${puedeVerUsuarios ? '<button Opcion="VerUsuarios" class="menu-item">Usuarios</button>' : ''}
                </div>
                <div class="Botones">
                    <button class="exit-button">Salir</button>
                </div>
            `;

        EspacioMenu.innerHTML = codigo;

        // Paso -> agregar evento al botón "Salir"
        let exitButton = EspacioMenu.querySelector(".exit-button");
        if (exitButton) { exitButton.addEventListener("click", CerrarSesion); }

        // Paso -> agregar eventos a los botones del menú
        let botones = EspacioMenu.querySelectorAll(".Opciones .menu-item");
        botones.forEach((boton) => { boton.addEventListener("click", () => { CambiarContenido(event, datos) }) });
    }
}

module.exports = { MostrarMenu };