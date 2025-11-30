// ====================================================================================================
// SISTEMA DE PRIVILEGIOS - CONTROL DE ACCESO BASADO EN ROLES (RBAC)
// ====================================================================================================
// Este módulo centraliza la definición de roles y privilegios del sistema.
// Permite validar permisos de forma granular por módulo y acción.
// ====================================================================================================

// DEFINICIÓN DE ROLES Y PRIVILEGIOS
// Cada rol tiene permisos específicos para cada módulo del sistema
// Acciones disponibles: crear, editar, eliminar, ver, imprimir, descargar

const ROLES = {
    "Administrador": {
        clientes: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true
        },
        usuarios: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true
        },
        movimientosEconomicos: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true,
            imprimir: true
        },
        movimientosMateriales: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true,
            imprimir: true
        },
        compraVenta: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true,
            imprimir: true
        },
        cuentaEmpresarial: {
            ver: true
        },
        reportes: {
            descargar: true,
            imprimir: true
        }
    },
    "Cajero": {
        clientes: {
            crear: true,
            editar: true,
            eliminar: true,
            ver: true
        },
        usuarios: {
            crear: false,
            editar: false,
            eliminar: false,
            ver: false
        },
        movimientosEconomicos: {
            crear: true,
            editar: false,
            eliminar: false,
            ver: true,
            imprimir: true
        },
        movimientosMateriales: {
            crear: true,
            editar: false,
            eliminar: false,
            ver: true,
            imprimir: true
        },
        compraVenta: {
            crear: true,
            editar: false,
            eliminar: false,
            ver: true,
            imprimir: true
        },
        cuentaEmpresarial: {
            ver: true
        },
        reportes: {
            descargar: true,
            imprimir: true
        }
    }
};

// ====================================================================================================
// FUNCIONES PÚBLICAS
// ====================================================================================================

/**
 * Verifica si un rol tiene un privilegio específico
 * @param {string} rol - Nombre del rol (ej: "Administrador", "Cajero")
 * @param {string} modulo - Nombre del módulo (ej: "clientes", "usuarios")
 * @param {string} accion - Acción a verificar (ej: "crear", "editar", "eliminar")
 * @returns {boolean} - true si tiene el privilegio, false en caso contrario
 */
function verificarPrivilegio(rol, modulo, accion) {
    // Validar que el rol existe
    if (!ROLES[rol]) {
        console.warn(`SistemaPrivilegios: Rol "${rol}" no existe`);
        return false;
    }

    // Validar que el módulo existe para ese rol
    if (!ROLES[rol][modulo]) {
        console.warn(`SistemaPrivilegios: Módulo "${modulo}" no existe para el rol "${rol}"`);
        return false;
    }

    // Validar que la acción existe para ese módulo
    if (ROLES[rol][modulo][accion] === undefined) {
        console.warn(`SistemaPrivilegios: Acción "${accion}" no existe para el módulo "${modulo}"`);
        return false;
    }

    // Retornar el valor del privilegio
    return ROLES[rol][modulo][accion];
}

/**
 * Obtiene todos los privilegios de un rol
 * @param {string} rol - Nombre del rol
 * @returns {object|null} - Objeto con todos los privilegios del rol, o null si no existe
 */
function obtenerPrivilegiosRol(rol) {
    if (!ROLES[rol]) {
        console.warn(`SistemaPrivilegios: Rol "${rol}" no existe`);
        return null;
    }
    return ROLES[rol];
}

/**
 * Verifica si un rol tiene acceso a un módulo (al menos una acción permitida)
 * @param {string} rol - Nombre del rol
 * @param {string} modulo - Nombre del módulo
 * @returns {boolean} - true si tiene al menos una acción permitida en el módulo
 */
function tieneAccesoModulo(rol, modulo) {
    if (!ROLES[rol] || !ROLES[rol][modulo]) {
        return false;
    }

    // Verificar si al menos una acción está permitida
    const privilegios = ROLES[rol][modulo];
    return Object.values(privilegios).some(valor => valor === true);
}

/**
 * Obtiene la lista de acciones permitidas para un rol en un módulo
 * @param {string} rol - Nombre del rol
 * @param {string} modulo - Nombre del módulo
 * @returns {array} - Array con los nombres de las acciones permitidas
 */
function obtenerAccionesPermitidas(rol, modulo) {
    if (!ROLES[rol] || !ROLES[rol][modulo]) {
        return [];
    }

    const privilegios = ROLES[rol][modulo];
    return Object.keys(privilegios).filter(accion => privilegios[accion] === true);
}

/**
 * Obtiene la lista de todos los roles disponibles
 * @returns {array} - Array con los nombres de los roles
 */
function obtenerRolesDisponibles() {
    return Object.keys(ROLES);
}

/**
 * Verifica si un rol existe
 * @param {string} rol - Nombre del rol
 * @returns {boolean} - true si el rol existe
 */
function rolExiste(rol) {
    return ROLES[rol] !== undefined;
}

// ====================================================================================================
// EXPORTAR FUNCIONES
// ====================================================================================================

module.exports = {
    verificarPrivilegio,
    obtenerPrivilegiosRol,
    tieneAccesoModulo,
    obtenerAccionesPermitidas,
    obtenerRolesDisponibles,
    rolExiste
};
