const { ipcRenderer } = require("electron")

// Variables

// codigo
let Codigo

// Funciones

// Función -> Generar código
function GenerarCodigo(CapitalEconomico, CapitalMaterial, rolUsuario) {

    // mensaje de flujo
    console.log("DetalleCuentaEmpresarial: generando el código del componente")
    console.log("DetalleCuentaEmpresarial: rol del usuario:", rolUsuario)

    // Determinar si se deben mostrar los botones (solo para Administrador)
    let mostrarBotones = rolUsuario === "Administrador";
    let displayBotones = mostrarBotones ? "flex" : "none";

    // Paso -> generar codigo HTML
    Codigo = `
        <style>
            .capital-card {
                background: #3B82F6;
                margin: 10px 10px;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
                transition: all 0.3s ease;
                width: 100%;
                box-sizing: border-box;
            }
            
            .capital-card:hover {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
                transform: translateY(-2px);
            }
            
            .capital-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .capital-info {
                flex: 1;
            }
            
            .capital-label {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .capital-amount {
                font-size: 36px;
                font-weight: 700;
                color: #FFFFFF;
                margin: 0;
            }
            
            .capital-economico .capital-amount {
                color: #ffffff;
            }
            
            .capital-material .capital-amount {
                color: #ffffff;
            }
            
            .btn-capital {
                padding: 10px 18px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }
            
            .btn-aumentar {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
            }
            
            .btn-aumentar:hover {
                background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(76, 175, 80, 0.4);
            }
            
            .btn-disminuir {
                background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
                color: white;
            }
            
            .btn-disminuir:hover {
                background: linear-gradient(135deg, #da190b 0%, #c41408 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(244, 67, 54, 0.4);
            }
            
            .btn-capital:active {
                transform: translateY(0);
            }
            
            .botones-container {
                display: ${displayBotones};
                flex-direction: column;
                gap: 10px;
                margin-left: 25px;
            }
        </style>
        <div class="capital-card capital-economico">
            <div class="capital-header">
                <div class="capital-info">
                    <p class="capital-label">Capital Económico</p>
                    <p class="capital-amount">${CapitalEconomico} S/.</p>
                </div>
                <div class="botones-container">
                    <button id="BtnAumentarCapitalEconomico" class="btn-capital btn-aumentar">
                        <span>▲</span> Aumentar
                    </button>
                    <button id="BtnDisminuirCapitalEconomico" class="btn-capital btn-disminuir">
                        <span>▼</span> Disminuir
                    </button>
                </div>
            </div>
        </div>
        <div class="capital-card capital-material">
            <div class="capital-header">
                <div class="capital-info">
                    <p class="capital-label">Capital Material</p>
                    <p class="capital-amount">${CapitalMaterial} G.</p>
                </div>
                <div class="botones-container">
                    <button id="BtnAumentarCapitalMaterial" class="btn-capital btn-aumentar">
                        <span>▲</span> Aumentar
                    </button>
                    <button id="BtnDisminuirCapitalMaterial" class="btn-capital btn-disminuir">
                        <span>▼</span> Disminuir
                    </button>
                </div>
            </div>
        </div>
    `;

}

// Funcion -> agregar event listeners a los botones
function AgregarEventListeners() {

    // Botón aumentar capital económico
    let btnAumentarEconomico = document.getElementById("BtnAumentarCapitalEconomico")
    if (btnAumentarEconomico) {
        btnAumentarEconomico.addEventListener("click", () => {
            ipcRenderer.send("EQuiereIngresarMonto", { tipo: "aumentarEconomico" })
        })
    }

    // Botón disminuir capital económico
    let btnDisminuirEconomico = document.getElementById("BtnDisminuirCapitalEconomico")
    if (btnDisminuirEconomico) {
        btnDisminuirEconomico.addEventListener("click", () => {
            ipcRenderer.send("EQuiereIngresarMonto", { tipo: "disminuirEconomico" })
        })
    }

    // Botón aumentar capital material
    let btnAumentarMaterial = document.getElementById("BtnAumentarCapitalMaterial")
    if (btnAumentarMaterial) {
        btnAumentarMaterial.addEventListener("click", () => {
            ipcRenderer.send("EQuiereIngresarMonto", { tipo: "aumentarMaterial" })
        })
    }

    // Botón disminuir capital material
    let btnDisminuirMaterial = document.getElementById("BtnDisminuirCapitalMaterial")
    if (btnDisminuirMaterial) {
        btnDisminuirMaterial.addEventListener("click", () => {
            ipcRenderer.send("EQuiereIngresarMonto", { tipo: "disminuirMaterial" })
        })
    }
}

// Funcion -> cargar el componente resumenCE
function MostrarDetalleCuentaEmpresarial(CapitalEconomico, CapitalMaterial, rolUsuario) {

    // mensaje de flujo
    console.log("DetalleCuentaEmpresarial: cargando el componente")
    console.log("CapitalEconomico: ", CapitalEconomico, " CapitalMaterial: ", CapitalMaterial)
    console.log("DetalleCuentaEmpresarial: rol del usuario:", rolUsuario)

    // Paso -> obtener el espacio para cargar componente
    let Espacio = document.getElementById("EspacioCuentaEmpresarial")
    if (Espacio) {
        //mensaje de flujo
        console.log("DetalleCuentaEmpresarial: se obtubo el espacio para cargar el componente")
        // Paso -> generar codigo
        GenerarCodigo(CapitalEconomico, CapitalMaterial, rolUsuario)
        // Paso -> insertar html
        Espacio.innerHTML = Codigo
        // Paso -> agregar event listeners
        AgregarEventListeners()
    } else {
        //mensaje de flujo
        console.log("DetalleCuentaEmpresarial: no se obtubo el espacio para cargar el componente")
    }
}

// Eventos

// Evento -> actualizar capitales
ipcRenderer.on("EActualizarCapitales", (event, datos) => {
    console.log("DetalleCuentaEmpresarial: actualizando capitales")
    MostrarDetalleCuentaEmpresarial(datos.CapitalEconomico, datos.CapitalMaterial, datos.rolUsuario)
})

module.exports = { MostrarDetalleCuentaEmpresarial };