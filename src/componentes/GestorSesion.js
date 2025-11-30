// ====================================================================================================
// GESTOR DE SESIÓN - MANEJO DEL USUARIO AUTENTICADO
// ====================================================================================================
// Este módulo mantiene la información del usuario autenticado en el proceso principal (main.js)
// Proporciona funciones para establecer, obtener y limpiar la sesión del usuario
// ====================================================================================================

// VARIABLES PRIVADAS
let usuarioActual = null;

// ====================================================================================================
// FUNCIONES PÚBLICAS
// ====================================================================================================

/**
 * Establece el usuario autenticado en la sesión
 * @param {object} usuario - Objeto con los datos del usuario autenticado
 * @returns {boolean} - true si se estableció correctamente
 */
function establecerUsuario(usuario) {
    if (!usuario) {
        console.error("GestorSesion: No se puede establecer un usuario nulo");
        return false;
    }

    if (!usuario.ID || !usuario.Nombres || !usuario.Rol) {
        console.error("GestorSesion: El usuario debe tener ID, Nombres y Rol");
        return false;
    }

    usuarioActual = usuario;
    console.log(`GestorSesion: Usuario establecido - ${usuario.Nombres} (${usuario.Rol})`);
    return true;
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns {object|null} - Objeto con los datos del usuario o null si no hay sesión
 */
function obtenerUsuarioActual() {
    return usuarioActual;
}

/**
 * Obtiene solo el rol del usuario autenticado
 * @returns {string|null} - Nombre del rol o null si no hay sesión
 */
function obtenerRolActual() {
    return usuarioActual ? usuarioActual.Rol : null;
}

/**
 * Obtiene el ID del usuario autenticado
 * @returns {number|null} - ID del usuario o null si no hay sesión
 */
function obtenerIdActual() {
    return usuarioActual ? usuarioActual.ID : null;
}

/**
 * Obtiene el nombre completo del usuario autenticado
 * @returns {string|null} - Nombre completo o null si no hay sesión
 */
function obtenerNombreCompleto() {
    if (!usuarioActual) return null;

    const apellidos = usuarioActual.Apellidos || "";
    return `${usuarioActual.Nombres} ${apellidos}`.trim();
}

/**
 * Verifica si hay un usuario autenticado
 * @returns {boolean} - true si hay un usuario autenticado
 */
function estaAutenticado() {
    return usuarioActual !== null;
}

/**
 * Cierra la sesión del usuario actual
 * @returns {boolean} - true si se cerró correctamente
 */
function cerrarSesion() {
    if (usuarioActual) {
        console.log(`GestorSesion: Cerrando sesión de ${usuarioActual.Nombres}`);
        usuarioActual = null;
        return true;
    }
    console.warn("GestorSesion: No hay sesión activa para cerrar");
    return false;
}

/**
 * Obtiene información resumida de la sesión actual
 * @returns {object|null} - Objeto con información de la sesión o null
 */
function obtenerInfoSesion() {
    if (!usuarioActual) return null;

    return {
        id: usuarioActual.ID,
        nombre: obtenerNombreCompleto(),
        rol: usuarioActual.Rol,
        estado: usuarioActual.Estado
    };
}

// ====================================================================================================
// EXPORTAR FUNCIONES
// ====================================================================================================

module.exports = {
    establecerUsuario,
    obtenerUsuarioActual,
    obtenerRolActual,
    obtenerIdActual,
    obtenerNombreCompleto,
    estaAutenticado,
    cerrarSesion,
    obtenerInfoSesion
};
