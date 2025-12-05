$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 Aplicando ajustes finales: dorado opaco, gradientes sutiles, sombras reducidas..." -ForegroundColor Cyan

# ===================================================
# 1. TEXTO DORADO OPACO (como el logo)
# ===================================================

# Título REDSUR en el menú
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{', '#EspacioMenu>.Empresa>h1 { color: #B8860B;'

# Texto de bienvenida
$content = $content -replace '#EspacioMenu>.Empresa>p \{([^}]*)\}', '#EspacioMenu>.Empresa>p { color: #DAA520; font-size: 14px; margin: 5px 0; }'

# ===================================================
# 2. FONDOS CON GRADIENTES SUTILES (no sólidos)
# ===================================================

# Capital Económico y Capital Material - gradiente con zonas claras/oscuras
$content = $content -replace 'background: #F5F5F5;', 'background: linear-gradient(135deg, #0D1B2A 0%, #1B2838 50%, #0D1B2A 100%);'
$content = $content -replace 'background: #F9FAFB;', 'background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);'
$content = $content -replace 'background: white;', 'background: linear-gradient(135deg, #1A2332 0%, #243142 50%, #1A2332 100%);'
$content = $content -replace 'background: #F3F4F6;', 'background: linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.5) 50%, rgba(15, 23, 42, 0.3) 100%);'

# ===================================================
# 3. REDUCIR SOMBRAS EN 70%
# ===================================================

# Sombras de botones - reducir intensidad
$content = $content -replace 'box-shadow: 0 4px 15px rgba\(37, 99, 235, 0\.4\);', 'box-shadow: 0 2px 6px rgba(37, 99, 235, 0.15);'
$content = $content -replace 'box-shadow: 0 6px 25px rgba\(59, 130, 246, 0\.6\);', 'box-shadow: 0 3px 10px rgba(59, 130, 246, 0.2);'
$content = $content -replace 'box-shadow: 0 6px 25px rgba\(37, 99, 235, 0\.5\);', 'box-shadow: 0 3px 10px rgba(37, 99, 235, 0.18);'
$content = $content -replace 'box-shadow: 0 4px 15px rgba\(30, 64, 175, 0\.3\);', 'box-shadow: 0 2px 6px rgba(30, 64, 175, 0.12);'

# Sombras de tablas - mucho más sutiles
$content = $content -replace 'box-shadow: 0 2px 10px rgba\(30, 64, 175, 0\.3\);', 'box-shadow: 0 1px 4px rgba(30, 64, 175, 0.1);'
$content = $content -replace 'box-shadow: 0 4px 15px rgba\(30, 64, 175, 0\.4\);', 'box-shadow: 0 2px 6px rgba(30, 64, 175, 0.15);'

# Sombras de modales - reducir
$content = $content -replace 'box-shadow: 0 8px 32px rgba\(15, 23, 42, 0\.8\);', 'box-shadow: 0 4px 16px rgba(15, 23, 42, 0.3);'
$content = $content -replace 'box-shadow: 0 8px 32px rgba\(0, 0, 0, 0\.3\);', 'box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);'

# Sombras del logo - reducir
$content = $content -replace 'box-shadow: 0 6px 20px rgba\(59, 130, 246, 0\.4\);', 'box-shadow: 0 3px 10px rgba(59, 130, 246, 0.15);'

# Sombras dobles - simplificar
$content = $content -replace 'box-shadow: 0 6px 25px rgba\(30, 64, 175, 0\.5\), 0 0 40px rgba\(59, 130, 246, 0\.2\);', 'box-shadow: 0 3px 10px rgba(30, 64, 175, 0.2);'
$content = $content -replace 'box-shadow: 0 4px 15px rgba\(30, 64, 175, 0\.3\), 0 0 20px rgba\(59, 130, 246, 0\.15\);', 'box-shadow: 0 2px 6px rgba(30, 64, 175, 0.12);'

# Sombras en hover de menu items
$content = $content -replace 'box-shadow: 0 2px 10px rgba\(59, 130, 246, 0\.1\);', 'box-shadow: 0 1px 4px rgba(59, 130, 246, 0.05);'
$content = $content -replace 'box-shadow: 0 4px 15px rgba\(37, 99, 235, 0\.3\);', 'box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12);'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Ajustes aplicados: dorado opaco, gradientes sutiles, sombras reducidas 70%" -ForegroundColor Green
