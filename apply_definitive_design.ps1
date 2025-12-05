$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🌌 APLICANDO DISEÑO DEFINITIVO FUTURISTA OSCURO..." -ForegroundColor Magenta

# ========================================================
# DISEÑO DEFINITIVO - FUTURISTA OSCURO PREMIUM
# ========================================================

# ============= FONDO GENERAL =============
$content = $content -replace 'body \{', 'body { background: #050B17;'

# ============= MENÚ LATERAL =============
$content = $content -replace 'background: linear-gradient\(180deg, #0D1117 0%, #0A0F1C 100%\); border-right: 1px solid rgba\(59, 130, 246, 0\.1\);', 'background: #050B17; border-right: 1px solid rgba(30, 95, 255, 0.2);'

# Empresa section
$content = $content -replace 'text-align: center;', 'text-align: center; padding: 30px 20px;'

# Texto REDSUR - BLANCO PURO siempre
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{ color: #FFFFFF; text-shadow: 0 0 20px rgba\(59, 130, 246, 0\.5\);', '#EspacioMenu>.Empresa>h1 { color: #FFFFFF; font-size: 28px; font-weight: 700; text-shadow: 0 0 30px rgba(30, 95, 255, 0.6); letter-spacing: 2px;'

# Bienvenida - Blanco/Gris claro
$content = $content -replace '#EspacioMenu>.Empresa>p \{ color: #94A3B8;', '#EspacioMenu>.Empresa>p { color: #DDE3EC; font-size: 14px; margin: 8px 0;'

# Menu items
$content = $content -replace 'background: rgba\(15, 23, 42, 0\.4\); border-left: 2px solid transparent; transition: all 0\.3s ease;', 'background: transparent; border-left: 3px solid transparent; color: #DDE3EC; padding: 14px 20px; margin: 5px 10px; border-radius: 8px; transition: all 0.3s ease;'

# Menu items hover/active
$content = $content -replace 'background: rgba\(30, 58, 138, 0\.25\); border-left: 2px solid #3B82F6; box-shadow: 0 0 20px rgba\(59, 130, 246, 0\.15\);', 'background: rgba(30, 95, 255, 0.15); border-left: 3px solid #1E5FFF; color: #FFFFFF; box-shadow: 0 0 25px rgba(30, 95, 255, 0.3);'

# ============= ESPACIO CONTENIDO =============
$content = $content -replace '#EspacioContenido \{', '#EspacioContenido { background: #050B17;'

# Encabezado
$content = $content -replace 'background: transparent;', 'background: linear-gradient(90deg, rgba(15, 11, 23, 0.8) 0%, rgba(10, 15, 28, 0.5) 100%); padding: 25px 30px; border-bottom: 1px solid rgba(30, 95, 255, 0.2);'

# Nombre de ventana - Blanco
$content = $content -replace 'color: black;', 'color: #FFFFFF; font-weight: 600; text-shadow: 0 2px 10px rgba(30, 95, 255, 0.3);'

# ============= TARJETAS Y PANELES =============
# ELIMINAR TODOS LOS FONDOS BLANCOS Y GRISES
$content = $content -replace 'background: rgba\(15, 23, 42, 0\.5\); backdrop-filter: blur\(10px\); border: 1px solid rgba\(59, 130, 246, 0\.15\); border-radius: 12px;', 'background: linear-gradient(135deg, rgba(15, 11, 23, 0.7) 0%, rgba(10, 15, 28, 0.9) 100%); backdrop-filter: blur(15px); border: 1px solid rgba(30, 95, 255, 0.25); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);'

$content = $content -replace 'background: rgba\(15, 23, 42, 0\.4\); backdrop-filter: blur\(8px\); border: 1px solid rgba\(59, 130, 246, 0\.1\); border-radius: 10px;', 'background: linear-gradient(135deg, rgba(15, 11, 23, 0.6) 0%, rgba(10, 15, 28, 0.8) 100%); backdrop-filter: blur(12px); border: 1px solid rgba(30, 95, 255, 0.2); border-radius: 14px;'

$content = $content -replace 'background: rgba\(10, 15, 28, 0\.6\); border-radius: 8px;', 'background: #0F1626; border-radius: 12px; border: 1px solid rgba(30, 95, 255, 0.15);'

# Glassmorphism secciones
$content = $content -replace 'background: rgba\(15, 23, 42, 0\.3\); backdrop-filter: blur\(5px\);', 'background: rgba(15, 11, 23, 0.5); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(30, 95, 255, 0.1);'

# ============= BOTONES =============
# Botones principales - Azul eléctrico
$content = $content -replace 'background: rgba\(59, 130, 246, 0\.15\); border: 1px solid #3B82F6; color: #60A5FA; backdrop-filter: blur\(5px\);', 'background: rgba(30, 95, 255, 0.2); border: 2px solid #1E5FFF; color: #FFFFFF; backdrop-filter: blur(8px); font-weight: 600; padding: 12px 24px; border-radius: 10px; transition: all 0.3s ease;'

# Botones hover
$content = $content -replace 'background: rgba\(59, 130, 246, 0\.3\); border: 1px solid #60A5FA; color: #FFFFFF; box-shadow: 0 0 25px rgba\(59, 130, 246, 0\.4\);', 'background: #1E5FFF; border: 2px solid #3A7BFF; color: #FFFFFF; box-shadow: 0 0 35px rgba(30, 95, 255, 0.7), 0 0 60px rgba(107, 203, 255, 0.4);'

# Botones Ver
$content = $content -replace 'background: rgba\(59, 130, 246, 0\.12\); border: 1px solid rgba\(59, 130, 246, 0\.4\); color: #60A5FA; padding: 8px 16px; font-weight: 500;', 'background: rgba(30, 95, 255, 0.15); border: 2px solid #1E5FFF; color: #6BCBFF; padding: 10px 20px; font-weight: 600; border-radius: 20px; transition: all 0.3s ease;'

# Botón Ver hover
$content = $content -replace 'background: linear-gradient\(135deg, #1D4ED8 0%, #3B82F6 100%\); box-shadow: 0 3px 10px rgba\(37, 99, 235, 0\.18\);', 'background: #1E5FFF; box-shadow: 0 0 25px rgba(30, 95, 255, 0.6); transform: translateY(-2px);'

# Exit button - mantener rojo pero mejorado
$content = $content -replace 'background: linear-gradient\(135deg, #dc3545 0%, #c82333 100%\);', 'background: rgba(220, 53, 69, 0.2); border: 2px solid #dc3545;'

# ============= TABLAS =============
# Fondo de tabla - OSCURO
$content = $content -replace 'background: white;', 'background: #0F1626; border-radius: 12px; overflow: hidden;'

# Headers de tabla - Sin degradados toscos
$content = $content -replace 'background: rgba\(15, 23, 42, 0\.8\); color: #FFFFFF; border-bottom: 2px solid #3B82F6; font-weight: 600;', 'background: linear-gradient(90deg, #0A0F1C 0%, #0F1626 100%); color: #FFFFFF; border-bottom: 2px solid #1E5FFF; font-weight: 700; padding: 16px 12px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'

# Celdas de tabla
$content = $content -replace 'color: #CBD5E1;', 'color: #DDE3EC; padding: 14px 12px;'

# Bordes de celdas
$content = $content -replace 'border-bottom: 1px solid #E5E7EB;', 'border-bottom: 1px solid rgba(30, 95, 255, 0.08);'

# Hover de filas
$content = $content -replace 'background: rgba\(59, 130, 246, 0\.05\); border-left: 2px solid rgba\(59, 130, 246, 0\.3\);', 'background: rgba(30, 95, 255, 0.08); border-left: 3px solid #1E5FFF; transition: all 0.2s ease;'

# ============= BADGES (INGRESO/RETIRO) =============
# INGRESO - Verde neón elegante
$content = $content -replace 'background-color: #10b981;', 'background: linear-gradient(135deg, rgba(28, 203, 115, 0.25) 0%, rgba(28, 203, 115, 0.15) 100%); border: 2px solid #1CCB73; color: #1CCB73; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;'

# RETIRO - Rojo neón suave
$content = $content -replace 'background-color: #ef4444;', 'background: linear-gradient(135deg, rgba(255, 75, 75, 0.25) 0%, rgba(255, 75, 75, 0.15) 100%); border: 2px solid #FF4B4B; color: #FF4B4B; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;'

# ============= MODALES =============
# Overlay
$content = $content -replace 'background: rgba\(0, 0, 0, 0\.7\);', 'background: rgba(5, 11, 23, 0.9); backdrop-filter: blur(10px);'

# Contenedor modal
$content = $content -replace 'background: rgba\(13, 17, 23, 0\.95\); backdrop-filter: blur\(20px\); border: 1px solid rgba\(59, 130, 246, 0\.15\);', 'background: linear-gradient(135deg, #0A0F1C 0%, #0F1626 100%); backdrop-filter: blur(20px); border: 2px solid rgba(30, 95, 255, 0.3); border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);'

# Header de modal
$content = $content -replace 'background: rgba\(10, 15, 28, 0\.95\); backdrop-filter: blur\(10px\); border-bottom: 1px solid rgba\(59, 130, 246, 0\.2\);', 'background: linear-gradient(90deg, #0A0F1C 0%, #0F1626 100%); border-bottom: 2px solid #1E5FFF; padding: 25px 35px;'

# Título modal
$content = $content -replace 'color: #F8FAFC;', 'color: #FFFFFF; font-weight: 700; font-size: 24px; text-shadow: 0 2px 15px rgba(30, 95, 255, 0.4);'

# ============= TEXTOS GENERALES =============
$content = $content -replace 'color: #94A3B8;', 'color: #DDE3EC;'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ DISEÑO DEFINITIVO APLICADO: Futurista oscuro premium completo!" -ForegroundColor Green
Write-Host "   • Fondo: #050B17 (azul oscuro casi negro)" -ForegroundColor Cyan
Write-Host "   • Principal: #1E5FFF (azul eléctrico)" -ForegroundColor Cyan
Write-Host "   • Acentos: #6BCBFF (cian neón)" -ForegroundColor Cyan
Write-Host "   • Tablas: #0F1626 (oscuro)" -ForegroundColor Cyan
Write-Host "   • Badges: Verde #1CCB73 / Rojo #FF4B4B" -ForegroundColor Cyan
Write-Host "   • REDSUR: Blanco puro" -ForegroundColor Cyan
