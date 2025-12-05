$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "✨ Aplicando mejoras visuales profesionales..." -ForegroundColor Cyan

# Agregar estilos del logo y mejoras visuales
$improvements = @"

/* ===== LOGO REDSUR ===== */
.logo-redsur {
    width: 80px;
    height: auto;
    margin: 0 auto 16px auto;
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* ===== MEJORAS VISUALES PROFESIONALES ===== */

/* Border Radius Consistente */
.Formulario, .Capital, .DetallesDiaContenedor, #ContenedorMovimientos {
    border-radius: 8px !important;
}

button, .Boton, .BotonCode {
    border-radius: 4px !important;
}

/* Sombras Sutiles */
.Capital, #ContenedorMovimientos, .DetallesDiaContenedor {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

/* Typography Mejorada */
h1, .NombreVentana {
    font-size: 32px !important;
    color: #111827 !important;
    font-weight: bold !important;
}

h2 {
    font-size: 24px !important;
    color: #111827 !important;
    font-weight: 600 !important;
}

body, p, td {
    font-size: 16px !important;
    color: #6B7280 !important;
}

small, .texto-pequeño {
    font-size: 14px !important;
    color: #9CA3AF !important;
}

/* Spacing Consistente (Sistema 8px) */
.ContenidoIzquierdo {
    padding: 24px !important;
}

.ContenidoIzquierdo > * {
    margin-bottom: 16px !important;
}

/* Inputs Mejorados */
input, select, textarea {
    border-radius: 4px !important;
    padding: 12px 16px !important;
}

/* Estados Hover Mejorados */
button:hover:not(.exit-button), .Boton:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3) !important;
}

/* Tablas con Zebra Striping */
.Tabla tbody tr:nth-child(even) {
    background: #F8FAFC;
}

.SeccionMovimientos tbody tr:nth-child(even) {
    background: #F9FAFB;
}

"@

$content += $improvements
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Mejoras visuales aplicadas!" -ForegroundColor Green
Write-Host "   • Logo agregado al menú" -ForegroundColor Cyan
Write-Host "   • Border radius 8px/4px" -ForegroundColor Cyan
Write-Host "   • Sombras sutiles" -ForegroundColor Cyan
Write-Host "   • Tipografía mejorada" -ForegroundColor Cyan
Write-Host "   • Spacing sistema 8px" -ForegroundColor Cyan
Write-Host "   • Zebra striping en tablas" -ForegroundColor Cyan
