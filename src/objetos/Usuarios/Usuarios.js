// DEPENDENCIAS

    const fs = require("fs");
    const path = require("path");

// VARIABLES

    const RutaUsuarios = path.join(__dirname,"./usuarios.json")
    let Contenido
    let ErrorGeneral
    let Respuesta
    let ListaUsuarios = []
    let Contador = 0

// FUNCIONES

    // Funcion -> inicializar objeto
    function IniciarObjetoUsuario (){

        ErrorGeneral = false

        // Paso -> verificar que el archivo existe
        if(!fs.existsSync(RutaUsuarios)){
            console.log("/nUsuarios: el archivo usuarios.json fue eliminado")
            ErrorGeneral = true
        }
        // Paso -> leer el archivo json
        else{
            try{
                // Paso -> abrir el archivo json
                let rawContent = fs.readFileSync(RutaUsuarios,"utf8")
                Contenido = JSON.parse(rawContent)
                
                if(!Contenido){
                    console.log("/nUsuarios: el archivo usuarios.json se encuentra completamente vacio")
                    // Inicializar vacio si esta vacio
                    Contenido = { Contador: 0, Elementos: [] }
                    ListaUsuarios = []
                    Contador = 0
                }else{
                    // MIGRACION: Verificar si es un array (formato antiguo)
                    if (Array.isArray(Contenido)) {
                        console.log("Usuarios: Detectado formato antiguo (Array). Migrando a objeto estandar...")
                        ListaUsuarios = Contenido
                        // Calcular el ultimo ID para el contador
                        let maxID = 0
                        if (ListaUsuarios.length > 0) {
                            ListaUsuarios.forEach(u => {
                                if (u.ID > maxID) maxID = u.ID
                            })
                        }
                        Contador = maxID
                        
                        // Estructurar el nuevo contenido
                        Contenido = {
                            Contador: Contador,
                            Elementos: ListaUsuarios
                        }
                        
                        // Guardar inmediatamente el formato migrado
                        try {
                            fs.writeFileSync(RutaUsuarios, JSON.stringify(Contenido, null, 4), 'utf8');
                            console.log("Usuarios: Migracion completada exitosamente.")
                        } catch (err) {
                            console.error("Usuarios: Error al guardar la migracion.", err)
                            ErrorGeneral = true
                        }
                    } else {
                        // Formato correcto
                        Contador = Contenido.Contador
                        ListaUsuarios = Contenido.Elementos
                    }
                    ErrorGeneral = false
                }
            }catch(error){
                console.log("/nUsuarios: el archivo usuarios.json no se pudo leer", error)
                ErrorGeneral = true
            }
        }

        return ({"error":ErrorGeneral})
    }

    // Funcion -> cerrar objeto (guardar cambios)
    function CerrarObjetoUsuario (){

        ErrorGeneral = false

        // Paso -> guardar los datos actualizados en el archivo JSON
        try{
            // Paso -> actualizar los datos en el objeto contenido
            Contenido.Contador = Contador
            Contenido.Elementos = ListaUsuarios
            // Paso -> guardar el archivo
            fs.writeFileSync(RutaUsuarios,JSON.stringify(Contenido, null, 4), 'utf8');
            ErrorGeneral = false
        }catch(error){
            console.error("\nUsuarios: no se pudo escribir en el archivo usuarios.json");
            ErrorGeneral = true
        }

        return ({"error":ErrorGeneral})
    }

    // Funcion -> guardar nuevo usuario
    function GuardarUsuario (DetalleUsuario){

        ErrorGeneral = false

        // mensjae de flujo
        console.log("\nUsuarios: se guardara a este usuario")
        console.log(DetalleUsuario)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoUsuario()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> asignar id
            Contador = Contador + 1
            DetalleUsuario.ID = Contador
            
            // Paso -> incluir en la lista
            ListaUsuarios.push(DetalleUsuario)

            // Paso -> guardar los datos con el cierre
            Respuesta = CerrarObjetoUsuario()
            if(Respuesta.error == true){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }

        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    // Funcion -> editar usuario
    function EditarUsuario (DetalleUsuario){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nUsuarios: se editara el siguiente usuario con estos datos: ")
        console.log(DetalleUsuario)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoUsuario()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> buscar el indice del usuario con el ID
            let IndiceUsuario = ListaUsuarios.findIndex(Usuario => Usuario.ID == DetalleUsuario.ID)
            if(IndiceUsuario === -1){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{

                // Paso -> actualizar datos en la lista
                ListaUsuarios[IndiceUsuario] = {
                    ...ListaUsuarios[IndiceUsuario], // para mantener los valores originales
                    ...DetalleUsuario, // para sobrescribir con los nuevos datos
                    ID: ListaUsuarios[IndiceUsuario].ID // asegurar ID
                }

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoUsuario()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    // Funcion -> eliminar usuario
    function EliminarUsuario (IDUsuario){

        ErrorGeneral = false

        // mensaje de flujo
        console.log("\nUsuarios: se eliminara el usuario con ID: ")
        console.log(IDUsuario)

        // Paso -> iniciar el objeto
        Respuesta = IniciarObjetoUsuario()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }else{

            // Paso -> buscar el indice del usuario con el ID
            let IndiceUsuario = ListaUsuarios.findIndex(Usuario => Usuario.ID == IDUsuario)
            if(IndiceUsuario === -1){
                ErrorGeneral = true
                return ({"error":ErrorGeneral})
            }else{

                // Paso -> eliminar al usuario
                ListaUsuarios.splice(IndiceUsuario,1)

                // Paso -> guardar la lista 
                Respuesta = CerrarObjetoUsuario()
                if(Respuesta.error == true){
                    ErrorGeneral = true
                    return ({"error":ErrorGeneral})
                }
            }
        }

        // Informar si todo ha ido bien
        return ({"error":ErrorGeneral})

    }

    // Funcion -> obtener lista de usuarios
    function ObtenerListaUsuarios (){

        ErrorGeneral = false

        // Paso -> inciar para obtener variables
        Respuesta = IniciarObjetoUsuario()
        if(Respuesta.error == true){
            ErrorGeneral = true
            return ({"error":ErrorGeneral})
        }
        
        return ({"error":ErrorGeneral,"ListaDeUsuarios":ListaUsuarios})

    }

// EXPORTAR
module.exports = {
    GuardarUsuario,
    EditarUsuario,
    EliminarUsuario,
    ObtenerListaUsuarios
}
