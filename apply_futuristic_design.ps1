$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🚀 Aplicando diseño FUTURISTA con glassmorphism y neón sutil..." -ForegroundColor Cyan

# ===================================================
# DISEÑO FUTURISTA - OSCURO, ELEGANTE, MINIMALISTA
# ===================================================

# ============= FONDO GENERAL =============
# Fondo principal - Azul muy oscuro casi negro
$content = $content -replace 'background: linear-gradient\(180deg, #0A192F 0%, #1E3A5F 100%\);', 'background: #0A0F1C;'

# ============= MENÚ LATERAL =============
# Menú - Fondo oscuro con brillo sutil
$content = $content -replace 'background: #0A0F1C;', 'background: linear-gradient(180deg, #0D1117 0%, #0A0F1C 100%); border-right: 1px solid rgba(59, 130, 246, 0.1);'

# Menu items - Glassmorphism sutil
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(37, 99, 235, 0\.15\) 0%, rgba\(59, 130, 246, 0\.05\) 100%\); box-shadow: 0 1px 4px rgba\(59, 130, 246, 0\.05\);', 'background: rgba(15, 23, 42, 0.4); border-left: 2px solid transparent; transition: all 0.3s ease;'

# Menu items hover/active - Neón azul sutil
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(37, 99, 235, 0\.3\) 0%, rgba\(59, 130, 246, 0\.15\) 100%\); box-shadow: 0 2px 6px rgba\(37, 99, 235, 0\.12\);', 'background: rgba(30, 58, 138, 0.25); border-left: 2px solid #3B82F6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);'

# ============= TEXTOS =============
# Texto REDSUR - Blanco con brillo neón
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{ color: #B8860B;', '#EspacioMenu>.Empresa>h1 { color: #FFFFFF; text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);'

# Texto bienvenida - Gris claro
$content = $content -replace '#EspacioMenu>.Empresa>p \{ color: #DAA520;', '#EspacioMenu>.Empresa>p { color: #94A3B8;'

# ============= TARJETAS Y PANELES =============
# Tarjetas principales - Glassmorphism
$content = $content -replace 'background: linear-gradient\(135deg, #0D1B2A 0%, #1B2838 50%, #0D1B2A 100%\);', 'background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px;'
$content = $content -replace 'background: linear-gradient\(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%\);', 'background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px;'

# Fondos internos - Más oscuros y limpios
$content = $content -replace 'background: linear-gradient\(135deg, #1A2332 0%, #243142 50%, #1A2332 100%\);', 'background: rgba(10, 15, 28, 0.6); border-radius: 8px;'

# Secciones - Glassmorphism sutil
$content = $content -replace 'background: linear-gradient\(135deg, rgba\(15, 23, 42, 0\.3\) 0%, rgba\(30, 41, 59, 0\.5\) 50%, rgba\(15, 23, 42, 0\.3\) 100%\);', 'background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(5px);'

# ============= BOTONES =============
# Botones principales - Neón azul minimalista
$content = $content -replace 'background: linear-gradient\(135deg, #1E40AF 0%, #3B82F6 100%\); box-shadow: 0 2px 6px rgba\(37, 99, 235, 0\.15\);', 'background: rgba(59, 130, 246, 0.15); border: 1px solid #3B82F6; color: #60A5FA; backdrop-filter: blur(5px);'

# Botones hover - Brillo neón
$content = $content -replace 'background: linear-gradient\(135deg, #2563EB 0%, #60A5FA 100%\); box-shadow: 0 3px 10px rgba\(59, 130, 246, 0\.2\);', 'background: rgba(59, 130, 246, 0.3); border: 1px solid #60A5FA; color: #FFFFFF; box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);'

# Botones Ver - Minimalistas
$content = $content -replace 'background: linear-gradient\(135deg, #1E40AF 0%, #3B82F6 100%\); box-shadow: 0 2px 6px rgba\(30, 64, 175, 0\.15\);', 'background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.4); color: #60A5FA; padding: 8px 16px; font-weight: 500;'

# ============= TABLAS =============
# Headers de tabla - Oscuros con línea neón
$content = $content -replace 'background: linear-gradient\(135deg, #1E40AF 0%, #3B82F6 100%\); box-shadow: 0 1px 4px rgba\(30, 64, 175, 0\.1\);', 'background: rgba(15, 23, 42, 0.8); color: #FFFFFF; border-bottom: 2px solid #3B82F6; font-weight: 600;'

# Hover de filas - Brillo sutil
$content = $content -replace 'background-color: rgba\(37, 99, 235, 0\.05\);', 'background: rgba(59, 130, 246, 0.05); border-left: 2px solid rgba(59, 130, 246, 0.3);'

# ============= MODALES =============
# Headers de modales - Oscuros elegantes
$content = $content -replace 'background: linear-gradient\(135deg, #0F172A 0%, #1E40AF 100%\); box-shadow: 0 4px 16px rgba\(15, 23, 42, 0\.3\);', 'background: rgba(10, 15, 28, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(59, 130, 246, 0.2);'

# Contenedores de modales - Glassmorphism
$content = $content -replace 'box-shadow: 0 4px 16px rgba\(0, 0, 0, 0\.15\);', 'background: rgba(13, 17, 23, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(59, 130, 246, 0.15);'

# ============= BORDES Y SEPARADORES =============
# Bordes - Neón sutil
$content = $content -replace 'border-bottom: 3px solid #3B82F6; box-shadow: 0 2px 10px rgba\(59, 130, 246, 0\.2\);', 'border-bottom: 2px solid rgba(59, 130, 246, 0.4); box-shadow: 0 2px 15px rgba(59, 130, 246, 0.15);'
$content = $content -replace 'border: 3px solid #3B82F6; box-shadow: 0 0 15px rgba\(59, 130, 246, 0\.3\);', 'border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);'

# ============= COLORES DE TEXTO =============
# Títulos - Blanco brillante
$content = $content -replace 'color: #1E40AF;', 'color: #F8FAFC;'

# Textos generales - Gris claro legible
$content = $content -replace 'color: #374151;', 'color: #CBD5E1;'
$content = $content -replace 'color: #9CA3AF;', 'color: #94A3B8;'

# ============= FONDO DEL ENCABEZADO =============
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(30, 58, 95, 0\.08\) 0%, transparent 100%\);', 'background: transparent;'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Diseño FUTURISTA aplicado: oscuro, elegante, glassmorphism, neón sutil!" -ForegroundColor Green
