$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "✨ Aplicando mejoras finales de consistencia..." -ForegroundColor Cyan

# Mejorar separación y jerarquía visual
$improvements = @"

/* ===== MEJORAS FINALES DE CONSISTENCIA ===== */

/* Mejorar espaciado en secciones */
.ContenidoIzquierdo {
    padding: 25px;
}

/* Títulos más destacados */
.NombreVentana {
    margin-bottom: 25px;
    letter-spacing: 1px;
}

/* Separación entre elementos */
.ContenidoIzquierdo > * {
    margin-bottom: 20px;
}

/* Sombras sutiles en cards */
[class*='Tarjeta'], [class*='Card'] {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

/* Mejorar legibilidad de textos pequeños */
small, .texto-pequeño {
    color: #94A3B8;
    font-size: 13px;
}

/* Botones más prominentes */
button:not(.exit-button) {
    font-size: 14px;
    letter-spacing: 0.5px;
}

/* Inputs más legibles */
input, select, textarea {
    background: rgba(15, 23, 42, 0.6) !important;
    border: 1px solid rgba(59, 130, 246, 0.3) !important;
    color: #E2E8F0 !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
}

input:focus, select:focus, textarea:focus {
    border-color: #3B82F6 !important;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4) !important;
}

/* Labels más claros */
label {
    color: #CBD5E1 !important;
    font-weight: 500 !important;
    margin-bottom: 8px !important;
    display: block !important;
}

"@

$content += $improvements
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Mejoras aplicadas - Mayor consistencia y legibilidad!" -ForegroundColor Green
