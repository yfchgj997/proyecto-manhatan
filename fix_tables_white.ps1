$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 Arreglando tablas: FONDO BLANCO..." -ForegroundColor Cyan

# ===================================================
# TABLAS CON FONDO BLANCO (NO OSCURO)
# ===================================================

# Fondo de tabla principal - BLANCO
$content = $content -replace 'background: #0F1626; border-radius: 12px; overflow: hidden;', 'background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);'

# Headers de tabla - Azul eléctrico con fondo sólido
$content = $content -replace 'background: linear-gradient\(90deg, #0A0F1C 0%, #0F1626 100%\); color: #FFFFFF; border-bottom: 2px solid #1E5FFF; font-weight: 700; padding: 16px 12px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;', 'background: #1E5FFF; color: #FFFFFF; border-bottom: none; font-weight: 700; padding: 16px 12px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'

# Celdas de tabla - Texto oscuro sobre fondo blanco
$content = $content -replace 'color: #DDE3EC; padding: 14px 12px;', 'color: #1F2937; padding: 14px 12px; font-size: 14px;'

# Bordes de celdas - Gris claro
$content = $content -replace 'border-bottom: 1px solid rgba\(30, 95, 255, 0\.08\);', 'border-bottom: 1px solid #E5E7EB;'

# Hover de filas - Azul muy claro
$content = $content -replace 'background: rgba\(30, 95, 255, 0\.08\); border-left: 3px solid #1E5FFF; transition: all 0\.2s ease;', 'background: rgba(30, 95, 255, 0.05); border-left: 3px solid #1E5FFF; transition: all 0.2s ease;'

# Filas alternadas (si existen)
$content = $content -replace 'background: rgba\(15, 23, 42, 0\.05\);', 'background: #F9FAFB;'

# Secciones de movimientos - Fondo claro
$content = $content -replace 'background: rgba\(15, 11, 23, 0\.5\); backdrop-filter: blur\(10px\); border-radius: 12px; border: 1px solid rgba\(30, 95, 255, 0\.1\);', 'background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(30, 95, 255, 0.2);'

# Mensaje vacío en tablas
$content = $content -replace 'color: #DDE3EC;', 'color: #6B7280;'

Write-Host "✅ Tablas arregladas: Fondo blanco, texto oscuro, headers azul eléctrico" -ForegroundColor Green
$content | Out-File $cssPath -Encoding UTF8 -NoNewline
