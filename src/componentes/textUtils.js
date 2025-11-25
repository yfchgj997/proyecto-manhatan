// Función utilitaria para convertir inputs de texto a mayúsculas

/**
 * Aplica conversión automática a mayúsculas en un input de texto
 * @param {HTMLInputElement} inputElement - El elemento input a convertir
 */
function aplicarMayusculas(inputElement) {
    if (!inputElement) {
        console.warn("No se pudo aplicar mayúsculas: elemento no encontrado");
        return;
    }

    inputElement.addEventListener("input", function (e) {
        // Guardar la posición del cursor
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // Convertir a mayúsculas
        this.value = this.value.toUpperCase();

        // Restaurar la posición del cursor
        this.setSelectionRange(start, end);
    });
}

/**
 * Aplica conversión automática a mayúsculas en múltiples inputs
 * @param {Array<string>} inputIds - Array de IDs de elementos input
 */
function aplicarMayusculasMultiple(inputIds) {
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.type === "text") {
            aplicarMayusculas(input);
        }
    });
}

/**
 * Establece la fecha actual del sistema en un input de tipo date
 * @param {HTMLInputElement} inputElement - El elemento input de tipo date
 */
function establecerFechaActual(inputElement) {
    if (!inputElement || inputElement.type !== "date") {
        console.warn("No se pudo establecer fecha actual: elemento no válido");
        return;
    }

    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaActual = `${año}-${mes}-${dia}`;

    inputElement.value = fechaActual;
}

/**
 * Restringe la selección de fechas futuras en un input de tipo date
 * @param {HTMLInputElement} inputElement - El elemento input de tipo date
 */
function restringirFechasFuturas(inputElement) {
    if (!inputElement || inputElement.type !== "date") {
        console.warn("No se pudo restringir fechas futuras: elemento no válido");
        return;
    }

    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaMaxima = `${año}-${mes}-${dia}`;

    inputElement.setAttribute("max", fechaMaxima);
}

/**
 * Habilita la navegación con Enter entre inputs de un formulario
 * @param {HTMLElement} containerElement - El contenedor que contiene los inputs
 */
function habilitarNavegacionEnter(containerElement) {
    if (!containerElement) {
        console.warn("No se pudo habilitar navegación con Enter: contenedor no válido");
        return;
    }

    // Obtener todos los elementos interactivos (inputs, selects, buttons)
    const elementos = containerElement.querySelectorAll('input, select, textarea, button');
    const elementosArray = Array.from(elementos);

    elementosArray.forEach((elemento, index) => {
        // Solo agregar listener a inputs, selects y textareas (no a buttons)
        if (elemento.tagName !== 'BUTTON') {
            elemento.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevenir el comportamiento por defecto

                    // Buscar el siguiente elemento enfocable
                    let siguienteIndex = index + 1;
                    while (siguienteIndex < elementosArray.length) {
                        const siguienteElemento = elementosArray[siguienteIndex];

                        // Verificar si el elemento es enfocable y no es un botón
                        if (siguienteElemento.tagName !== 'BUTTON' &&
                            !siguienteElemento.disabled &&
                            !siguienteElemento.readOnly) {
                            siguienteElemento.focus();
                            break;
                        }
                        siguienteIndex++;
                    }
                }
            });
        }
    });
}

module.exports = {
    aplicarMayusculas,
    aplicarMayusculasMultiple,
    establecerFechaActual,
    restringirFechasFuturas,
    habilitarNavegacionEnter
};
