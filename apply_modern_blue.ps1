$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 Aplicando diseño azul moderno con efectos glow..." -ForegroundColor Cyan

# ===================================================
# DISEÑO MODERNO - AZUL OSCURO CON EFECTOS GLOW
# ===================================================

# Menú lateral - Azul muy oscuro con gradiente profundo
$content = $content -replace 'background: linear-gradient\(180deg, #0A1828 0%, #2C3E50 100%\);', 'background: linear-gradient(180deg, #0A192F 0%, #1E3A5F 100%);'

# Menu items - Efecto glow sutil
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.3\) 100%\);', 'background: linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%); box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);'
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.4\) 100%\);', 'background: linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);'

# Fondo del encabezado
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(23, 133, 130, 0\.05\) 0%, transparent 100%\);', 'background: linear-gradient(90deg, rgba(30, 58, 95, 0.08) 0%, transparent 100%);'

# Headers oscuros profundos
$content = $content -replace 'background: linear-gradient\(135deg, #2C3E50 0%, #34495E 100%\);', 'background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);'

# Botones azules con glow
$content = $content -replace 'background: #007bff;', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);'
$content = $content -replace 'background-color: #007bff;', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);'
$content = $content -replace 'background-color: #4aa3ff;', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);'

# Hover con más glow
$content = $content -replace 'background-color: #1b82e9;', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%); box-shadow: 0 6px 25px rgba(59, 130, 246, 0.6);'
$content = $content -replace 'background-color: #0056b3;', 'background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%); box-shadow: 0 6px 25px rgba(29, 78, 216, 0.5);'

# Headers de tablas con glow
$content = $content -replace 'background: #52a5ff;', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 2px 10px rgba(30, 64, 175, 0.3);'

# Hover de filas
$content = $content -replace 'background-color: #f4f9ff;', 'background-color: rgba(37, 99, 235, 0.05);'

# Botones "Ver" (púrpura a azul con glow)
$content = $content -replace 'background: linear-gradient\(135deg, #8B5CF6 0%, #A78BFA 100%\);', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);'
$content = $content -replace 'background: linear-gradient\(135deg, #7C3AED 0%, #8B5CF6 100%\);', 'background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);'

# Modales con fondo oscuro y glow
$content = $content -replace 'background: linear-gradient\(135deg, #007bff 0%, #178582 100%\);', 'background: linear-gradient(135deg, #0F172A 0%, #1E40AF 100%); box-shadow: 0 8px 32px rgba(15, 23, 42, 0.8);'

# SeccionMovim headers oscuros
$content = $content -replace 'background: linear-gradient\(135deg, #178582 0%, #40E0D0 100%\);', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #40E0D0 0%, #7FFFD4 100%\);', 'background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);'

# Botones Ver específicos con glow
$content = $content -replace 'background: linear-gradient\(135deg, #00838f 0%, #006064 100%\);', 'background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);'
$content = $content -replace 'background: linear-gradient\(135deg, #0097a7 0%, #00838f 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);'

# Backgrounds azules claros
$content = $content -replace 'background: #449eff;', 'background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);'

# Colores de texto azul oscuro
$content = $content -replace 'color: #007bff;', 'color: #1E40AF;'

# Bordes con glow
$content = $content -replace 'border-bottom: 2px solid #8B5CF6;', 'border-bottom: 3px solid #3B82F6; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);'
$content = $content -replace 'border: 3px solid #178582;', 'border: 3px solid #3B82F6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);'

# Sombras más pronunciadas con glow
$content = $content -replace 'box-shadow: 0 4px 12px rgba\(139, 92, 246, 0\.5\);', 'box-shadow: 0 6px 25px rgba(30, 64, 175, 0.5), 0 0 40px rgba(59, 130, 246, 0.2);'
$content = $content -replace 'box-shadow: 0 2px 8px rgba\(139, 92, 246, 0\.3\);', 'box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3), 0 0 20px rgba(59, 130, 246, 0.15);'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Diseño azul moderno con efectos glow aplicado!" -ForegroundColor Green
