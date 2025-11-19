const { ipcRenderer } = require("electron");

// Variables

    // codigo
    let codigo = `
        <div class="Formulario">
            <h2 class="EncabezadoFormulario">Nuevo Cliente</h2>
            <div class="Campos">
                <div class="Campo">
                    <p>Nombres:</p>
                    <input id="CampoNombres" name="nombres" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>Apellidos:</p>
                    <input id="CampoApellidos" name="apellidos" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>DNI:</p>
                    <input id="CampoDNI" name="DNI" type="text" placeholder="...">
                </div>
                <div class="Campo">
                    <p>Fecha:</p>
                    <input id="CampoFecha" name="fecha" type="date">
                </div>
            </div>
            <button class="Boton BotonFormulario" id="BotonGuardarNuevoCliente">Guardar</button>
        </div>
    `

// Funciones

    // Funcion -> guardar un nuevo cliente
    function GardarNuevoCliente (){

        // mensaje de flujo
        console.log("MENSAJE: guardando un nuevo cliente")

        // paso -> crear una variable y capturar los datos
        let NuevoCliente = {
            "Nombres":document.getElementById("CampoNombres").value,
            "Apellidos":document.getElementById("CampoApellidos").value, 
            "DNI":document.getElementById("CampoDNI").value,
            "SaldoEconomico":0,
            "SaldoMaterial":0,
            "FechaIngreso":document.getElementById("CampoFecha").value 
        }

        // mensaje de flujo
        console.log("MENSAJE: estos son los datos:")
        console.log(NuevoCliente)

        // Paso -> enviar los datos del cliente al main
        ipcRenderer.send("EGuardarNuevoCliente",NuevoCliente)
        
    }

    // Funcion -> cargar encabezado
    function CargarFormularioNuevoCliente (){

        // mensaje de flujo
        console.log("MENSAJE: cargando el componente formulario nuevo cliente")

        // Paso -> obtener el espacio donde colocar el encabezado
        let EspacioFormularioNuevoCliente = document.getElementById("EspacioFormularioNuevoCliente")
        if(EspacioFormularioNuevoCliente){
            // Paso -> insertar codigo
            EspacioFormularioNuevoCliente.innerHTML = codigo
            // Paso -> agregar funcionalidad de boton
            document.getElementById("BotonGuardarNuevoCliente").addEventListener("click",GardarNuevoCliente)
        }else{
            // mensaje de flujo
            console.log("ERROR: no se pudo obtener el espacio para colocar encabezado")
        }

    }

module.exports = { CargarFormularioNuevoCliente };