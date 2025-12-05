$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 CAMBIANDO A DISEÑO CLARO CON PALETA AZUL SUAVE..." -ForegroundColor Cyan

# ===================================================
# DISEÑO CLARO - AZULES SUAVES Y PROFESIONALES
# Paleta: #EAF2FF (muy claro), #A8C7FF (claro), #4D93FF (medio), #1E5EFF (vibrante), #002C77 (oscuro)
# ===================================================

# ============= FONDO GENERAL - CLARO =============
$content = $content -replace 'body \{ background: #050B17;', 'body { background: #F5F8FF;'

# ============= MENÚ LATERAL - AZUL SUAVE =============
$content = $content -replace 'background: #050B17; border-right: 1px solid rgba\(30, 95, 255, 0\.2\);', 'background: linear-gradient(180deg, #EAF2FF 0%, #D6E4FF 100%); border-right: 2px solid #4D93FF;'

# Padding empresa
$content = $content -replace 'text-align: center; padding: 30px 20px;', 'text-align: center; padding: 30px 20px; background: #FFFFFF; margin: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(77, 147, 255, 0.1);'

# Texto REDSUR - Azul oscuro
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{ color: #FFFFFF; font-size: 28px; font-weight: 700; text-shadow: 0 0 30px rgba\(30, 95, 255, 0\.6\); letter-spacing: 2px;', '#EspacioMenu>.Empresa>h1 { color: #002C77; font-size: 28px; font-weight: 700; letter-spacing: 2px;'

# Bienvenida - Azul medio
$content = $content -replace '#EspacioMenu>.Empresa>p \{ color: #DDE3EC; font-size: 14px; margin: 8px 0;', '#EspacioMenu>.Empresa>p { color: #4D93FF; font-size: 14px; margin: 8px 0;'

# Menu items - Fondo claro
$content = $content -replace 'background: transparent; border-left: 3px solid transparent; color: #DDE3EC; padding: 14px 20px; margin: 5px 10px; border-radius: 8px; transition: all 0\.3s ease;', 'background: #FFFFFF; border-left: 3px solid transparent; color: #002C77; padding: 14px 20px; margin: 5px 10px; border-radius: 8px; transition: all 0.3s ease; font-weight: 500;'

# Menu items hover/active - Azul vibrante
$content = $content -replace 'background: rgba\(30, 95, 255, 0\.15\); border-left: 3px solid #1E5FFF; color: #FFFFFF; box-shadow: 0 0 25px rgba\(30, 95, 255, 0\.3\);', 'background: #4D93FF; border-left: 3px solid #1E5EFF; color: #FFFFFF; box-shadow: 0 4px 12px rgba(77, 147, 255, 0.3);'

# ============= ESPACIO CONTENIDO - CLARO =============
$content = $content -replace '#EspacioContenido \{ background: #050B17;', '#EspacioContenido { background: #F5F8FF;'

# Encabezado - Blanco con borde azul
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(15, 11, 23, 0\.8\) 0%, rgba\(10, 15, 28, 0\.5\) 100%\); padding: 25px 30px; border-bottom: 1px solid rgba\(30, 95, 255, 0\.2\);', 'background: #FFFFFF; padding: 25px 30px; border-bottom: 3px solid #4D93FF; box-shadow: 0 2px 15px rgba(77, 147, 255, 0.1);'

# Nombre de ventana - Azul oscuro
$content = $content -replace 'color: #FFFFFF; font-weight: 600; text-shadow: 0 2px 10px rgba\(30, 95, 255, 0\.3\);', 'color: #002C77; font-weight: 700; font-size: 32px;'

# ============= TARJETAS Y PANELES - BLANCOS =============
$content = $content -replace 'background: linear-gradient\(135deg, rgba\(15, 11, 23, 0\.7\) 0%, rgba\(10, 15, 28, 0\.9\) 100%\); backdrop-filter: blur\(15px\); border: 1px solid rgba\(30, 95, 255, 0\.25\); border-radius: 16px; box-shadow: 0 8px 32px rgba\(0, 0, 0, 0\.5\);', 'background: #FFFFFF; border: 2px solid #A8C7FF; border-radius: 16px; box-shadow: 0 4px 20px rgba(77, 147, 255, 0.15);'

$content = $content -replace 'background: linear-gradient\(135deg, rgba\(15, 11, 23, 0\.6\) 0%, rgba\(10, 15, 28, 0\.8\) 100%\); backdrop-filter: blur\(12px\); border: 1px solid rgba\(30, 95, 255, 0\.2\); border-radius: 14px;', 'background: #FFFFFF; border: 2px solid #D6E4FF; border-radius: 14px; box-shadow: 0 3px 15px rgba(77, 147, 255, 0.1);'

$content = $content -replace 'background: #0F1626; border-radius: 12px; border: 1px solid rgba\(30, 95, 255, 0\.15\);', 'background: #F9FBFF; border-radius: 12px; border: 2px solid #EAF2FF;'

# ============= BOTONES - AZULES CLAROS =============
$content = $content -replace 'background: rgba\(30, 95, 255, 0\.2\); border: 2px solid #1E5FFF; color: #FFFFFF; backdrop-filter: blur\(8px\); font-weight: 600; padding: 12px 24px; border-radius: 10px; transition: all 0\.3s ease;', 'background: #4D93FF; border: none; color: #FFFFFF; font-weight: 600; padding: 12px 24px; border-radius: 10px; transition: all 0.3s ease; box-shadow: 0 3px 10px rgba(77, 147, 255, 0.3);'

# Botones hover
$content = $content -replace 'background: #1E5FFF; border: 2px solid #3A7BFF; color: #FFFFFF; box-shadow: 0 0 35px rgba\(30, 95, 255, 0\.7\), 0 0 60px rgba\(107, 203, 255, 0\.4\);', 'background: #1E5EFF; border: none; color: #FFFFFF; box-shadow: 0 6px 20px rgba(30, 94, 255, 0.4); transform: translateY(-2px);'

# Botones Ver - Azul claro
$content = $content -replace 'background: rgba\(30, 95, 255, 0\.15\); border: 2px solid #1E5FFF; color: #6BCBFF; padding: 10px 20px; font-weight: 600; border-radius: 20px; transition: all 0\.3s ease;', 'background: #A8C7FF; border: none; color: #002C77; padding: 10px 20px; font-weight: 600; border-radius: 20px; transition: all 0.3s ease;'

# Botón Ver hover
$content = $content -replace 'background: #1E5FFF; box-shadow: 0 0 25px rgba\(30, 95, 255, 0\.6\); transform: translateY\(-2px\);', 'background: #4D93FF; color: #FFFFFF; box-shadow: 0 4px 15px rgba(77, 147, 255, 0.3); transform: translateY(-2px);'

# ============= TABLAS - BLANCAS CON HEADERS AZULES =============
# Fondo blanco ya aplicado anteriormente

# Headers azul medio
$content = $content -replace 'background: #1E5FFF; color: #FFFFFF;', 'background: #4D93FF; color: #FFFFFF;'

# ============= BADGES - COLORES CLAROS =============
$content = $content -replace 'background: linear-gradient\(135deg, rgba\(28, 203, 115, 0\.25\) 0%, rgba\(28, 203, 115, 0\.15\) 100%\); border: 2px solid #1CCB73; color: #1CCB73;', 'background: #D1FAE5; border: 2px solid #10B981; color: #047857;'

$content = $content -replace 'background: linear-gradient\(135deg, rgba\(255, 75, 75, 0\.25\) 0%, rgba\(255, 75, 75, 0\.15\) 100%\); border: 2px solid #FF4B4B; color: #FF4B4B;', 'background: #FEE2E2; border: 2px solid #EF4444; color: #DC2626;'

# ============= MODALES - BLANCOS =============
$content = $content -replace 'background: rgba\(5, 11, 23, 0\.9\); backdrop-filter: blur\(10px\);', 'background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'

$content = $content -replace 'background: linear-gradient\(135deg, #0A0F1C 0%, #0F1626 100%\); backdrop-filter: blur\(20px\); border: 2px solid rgba\(30, 95, 255, 0\.3\); border-radius: 20px; box-shadow: 0 20px 60px rgba\(0, 0, 0, 0\.7\);', 'background: #FFFFFF; border: 3px solid #4D93FF; border-radius: 20px; box-shadow: 0 10px 40px rgba(77, 147, 255, 0.2);'

$content = $content -replace 'background: linear-gradient\(90deg, #0A0F1C 0%, #0F1626 100%\); border-bottom: 2px solid #1E5FFF; padding: 25px 35px;', 'background: #EAF2FF; border-bottom: 3px solid #4D93FF; padding: 25px 35px;'

# Título modal - Azul oscuro
$content = $content -replace 'color: #FFFFFF; font-weight: 700; font-size: 24px; text-shadow: 0 2px 15px rgba\(30, 95, 255, 0\.4\);', 'color: #002C77; font-weight: 700; font-size: 24px;'

# ============= TEXTOS - OSCUROS =============
$content = $content -replace 'color: #6B7280;', 'color: #374151;'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ DISEÑO CLARO APLICADO CON PALETA AZUL SUAVE!" -ForegroundColor Green
Write-Host "   • Fondo: #F5F8FF (azul muy claro)" -ForegroundColor Cyan
Write-Host "   • Menú: #EAF2FF (azul suave)" -ForegroundColor Cyan
Write-Host "   • Botones: #4D93FF (azul medio)" -ForegroundColor Cyan
Write-Host "   • Acentos: #1E5EFF (azul vibrante)" -ForegroundColor Cyan
Write-Host "   • Texto: #002C77 (azul oscuro)" -ForegroundColor Cyan
Write-Host "   • Tablas: Blanco con headers #4D93FF" -ForegroundColor Cyan
