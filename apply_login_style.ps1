$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 APLICANDO ESTILO DEL LOGIN A TODA LA INTERFAZ..." -ForegroundColor Magenta

# ===================================================
# ESTILO IGUAL AL LOGIN - Oscuro, Elegante, Profesional
# ===================================================

# ============= FONDO GENERAL =============
$content = $content -replace 'body \{ background: #F5F8FF;', 'body { background: linear-gradient(135deg, #0A1929 0%, #1E3A8A 100%);'

# ============= MENÚ LATERAL =============
$content = $content -replace 'background: linear-gradient\(180deg, #EAF2FF 0%, #D6E4FF 100%\); border-right: 2px solid #4D93FF;', 'background: linear-gradient(180deg, #0C1E3A 0%, #1E40AF 100%); border-right: 1px solid rgba(59, 130, 246, 0.3);'

# Empresa section - Glassmorphism oscuro
$content = $content -replace 'text-align: center; padding: 30px 20px; background: #FFFFFF; margin: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba\(77, 147, 255, 0\.1\);', 'text-align: center; padding: 30px 20px; background: rgba(12, 30, 58, 0.5); margin: 15px; border-radius: 12px; backdrop-filter: blur(10px); border: 1px solid rgba(59, 130, 246, 0.2);'

# REDSUR - Claro
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{ color: #002C77;', '#EspacioMenu>.Empresa>h1 { color: #FFFFFF; text-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);'

# Bienvenida - Azul claro
$content = $content -replace '#EspacioMenu>.Empresa>p \{ color: #4D93FF;', '#EspacioMenu>.Empresa>p { color: #93C5FD;'

# Menu items
$content = $content -replace 'background: #FFFFFF; border-left: 3px solid transparent; color: #002C77; padding: 14px 20px; margin: 5px 10px; border-radius: 8px; transition: all 0\.3s ease; font-weight: 500;', 'background: rgba(59, 130, 246, 0.08); border-left: 3px solid transparent; color: #BFDBFE; padding: 14px 20px; margin: 5px 10px; border-radius: 8px; transition: all 0.3s ease; font-weight: 500;'

# Menu items active
$content = $content -replace 'background: #4D93FF; border-left: 3px solid #1E5EFF; color: #FFFFFF; box-shadow: 0 4px 12px rgba\(77, 147, 255, 0\.3\);', 'background: rgba(59, 130, 246, 0.25); border-left: 3px solid #3B82F6; color: #FFFFFF; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);'

# ============= CONTENIDO =============
$content = $content -replace '#EspacioContenido \{ background: #F5F8FF;', '#EspacioContenido { background: transparent;'

# Encabezado - Glassmorphism oscuro
$content = $content -replace 'background: #FFFFFF; padding: 25px 30px; border-bottom: 3px solid #4D93FF; box-shadow: 0 2px 15px rgba\(77, 147, 255, 0\.1\);', 'background: rgba(12, 30, 58, 0.6); padding: 25px 30px; border-bottom: 2px solid rgba(59, 130, 246, 0.3); backdrop-filter: blur(10px);'

# Título - Claro
$content = $content -replace 'color: #002C77; font-weight: 700; font-size: 32px;', 'color: #FFFFFF; font-weight: 700; font-size: 32px; text-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);'

# ============= TARJETAS - GLASSMORPHISM =============
$content = $content -replace 'background: #FFFFFF; border: 2px solid #A8C7FF; border-radius: 16px; box-shadow: 0 4px 20px rgba\(77, 147, 255, 0\.15\);', 'background: rgba(12, 30, 58, 0.6); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 16px; backdrop-filter: blur(15px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);'

$content = $content -replace 'background: #FFFFFF; border: 2px solid #D6E4FF; border-radius: 14px; box-shadow: 0 3px 15px rgba\(77, 147, 255, 0\.1\);', 'background: rgba(12, 30, 58, 0.5); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 14px; backdrop-filter: blur(12px);'

$content = $content -replace 'background: #F9FBFF; border-radius: 12px; border: 2px solid #EAF2FF;', 'background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.15); backdrop-filter: blur(8px);'

# ============= BOTONES - ESTILO LOGIN =============
$content = $content -replace 'background: #4D93FF; border: none; color: #FFFFFF; font-weight: 600; padding: 12px 24px; border-radius: 10px; transition: all 0\.3s ease; box-shadow: 0 3px 10px rgba\(77, 147, 255, 0\.3\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); border: none; color: #FFFFFF; font-weight: 600; padding: 12px 24px; border-radius: 10px; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(30, 58, 138, 0.5);'

$content = $content -replace 'background: #1E5EFF; border: none; color: #FFFFFF; box-shadow: 0 6px 20px rgba\(30, 94, 255, 0\.4\); transform: translateY\(-2px\);', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%); border: none; color: #FFFFFF; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6); transform: translateY(-3px);'

$content = $content -replace 'background: #A8C7FF; border: none; color: #002C77;', 'background: rgba(59, 130, 246, 0.2); border: 1px solid #3B82F6; color: #BFDBFE;'

$content = $content -replace 'background: #4D93FF; color: #FFFFFF; box-shadow: 0 4px 15px rgba\(77, 147, 255, 0\.3\); transform: translateY\(-2px\);', 'background: #3B82F6; color: #FFFFFF; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); transform: translateY(-2px);'

# ============= TABLAS - Pero con fondos oscuros legibles =============
$content = $content -replace 'background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba\(0, 0, 0, 0\.15\);', 'background: rgba(15, 23, 42, 0.8); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'

# Headers tabla
$content = $content -replace 'background: #4D93FF; color: #FFFFFF;', 'background: linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%); color: #FFFFFF;'

# Celdas - Texto claro
$content = $content -replace 'color: #1F2937; padding: 14px 12px; font-size: 14px;', 'color: #E2E8F0; padding: 14px 12px; font-size: 14px;'

# Bordes
$content = $content -replace 'border-bottom: 1px solid #E5E7EB;', 'border-bottom: 1px solid rgba(59, 130, 246, 0.1);'

# Hover
$content = $content -replace 'background: rgba\(30, 95, 255, 0\.05\);', 'background: rgba(59, 130, 246, 0.12);'

# ============= BADGES - Ajustados =============
$content = $content -replace 'background: #D1FAE5; border: 2px solid #10B981; color: #047857;', 'background: rgba(16, 185, 129, 0.2); border: 2px solid #10B981; color: #6EE7B7;'

$content = $content -replace 'background: #FEE2E2; border: 2px solid #EF4444; color: #DC2626;', 'background: rgba(239, 68, 68, 0.2); border: 2px solid #EF4444; color: #FCA5A5;'

# ============= MODALES =============
$content = $content -replace 'background: rgba\(0, 0, 0, 0\.5\);', 'background: rgba(10, 25, 41, 0.9); backdrop-filter: blur(10px);'

$content = $content -replace 'background: #FFFFFF; border: 3px solid #4D93FF; border-radius: 20px; box-shadow: 0 10px 40px rgba\(77, 147, 255, 0\.2\);', 'background: rgba(12, 30, 58, 0.95); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 20px; backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);'

$content = $content -replace 'background: #EAF2FF; border-bottom: 3px solid #4D93FF;', 'background: rgba(15, 23, 42, 0.8); border-bottom: 2px solid #3B82F6; backdrop-filter: blur(10px);'

# Título modal
$content = $content -replace 'color: #002C77; font-weight: 700; font-size: 24px;', 'color: #FFFFFF; font-weight: 700; font-size: 24px; text-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);'

# ============= TEXTOS =============
$content = $content -replace 'color: #374151;', 'color: #CBD5E1;'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ ESTILO DEL LOGIN APLICADO A TODA LA INTERFAZ!" -ForegroundColor Green
Write-Host "   • Fondo: Gradiente azul oscuro" -ForegroundColor Cyan
Write-Host "   • Glassmorphism en todo" -ForegroundColor Cyan
Write-Host "   • Textos claros legibles" -ForegroundColor Cyan
Write-Host "   • Botones con gradiente azul" -ForegroundColor Cyan
Write-Host "   • Tablas oscuras con backdrop-filter" -ForegroundColor Cyan
