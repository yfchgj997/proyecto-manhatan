$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "Aplicando diseño azul oscuro profesional..." -ForegroundColor Cyan

# ============================================
# AZULES MÁS OSCUROS Y DEGRADADOS PRONUNCIADOS
# ============================================

# Menú lateral - AZUL MUY OSCURO con degradado pronunciado
$content = $content -replace 'background: linear-gradient\(180deg, #1E3A8A 0%, #3B82F6 100%\);', 'background: linear-gradient(180deg, #0C1E3A 0%, #1E3A8A 100%);'

# Menu items - Degradado azul oscuro a medio
$content = $content -replace 'background: linear-gradient\(90deg, #2563EB 0%, rgba\(59, 130, 246, 0\.3\) 100%\);', 'background: linear-gradient(90deg, #1E40AF 0%, rgba(30, 58, 138, 0.4) 100%);'
$content = $content -replace 'background: linear-gradient\(90deg, #1D4ED8 0%, rgba\(59, 130, 246, 0\.4\) 100%\);', 'background: linear-gradient(90deg, #1E3A8A 0%, rgba(37, 99, 235, 0.6) 100%);'

# Background sutil - azul oscuro
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(37, 99, 235, 0\.05\) 0%, transparent 100%\);', 'background: linear-gradient(90deg, rgba(12, 30, 58, 0.1) 0%, transparent 100%);'

# Headers oscuros - Degradado azul profundo
$content = $content -replace 'background: linear-gradient\(135deg, #1E3A8A 0%, #2563EB 100%\);', 'background: linear-gradient(135deg, #0C1E3A 0%, #1E40AF 100%);'

# Botones principales - Azul más oscuro
$content = $content -replace 'background: #3B82F6;', 'background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);'
$content = $content -replace 'background-color: #3B82F6;', 'background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);'

# Hover de botones - Azul muy oscuro
$content = $content -replace 'background-color: #1D4ED8;', 'background: linear-gradient(135deg, #0C1E3A 0%, #1E3A8A 100%);'
$content = $content -replace 'background-color: #1E40AF;', 'background: linear-gradient(135deg, #0A1929 0%, #1E3A8A 100%);'

# Headers de tablas - Degradado oscuro pronunciado
$content = $content -replace 'background: linear-gradient\(135deg, #2563EB 0%, #3B82F6 100%\);', 'background: linear-gradient(135deg, #0C1E3A 0%, #1E40AF 100%);'

# Botones Ver - Degradado azul oscuro a medio
$content = $content -replace 'background: linear-gradient\(135deg, #2563EB 0%, #60A5FA 100%\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #1D4ED8 0%, #3B82F6 100%\);', 'background: linear-gradient(135deg, #0C1E3A 0%, #2563EB 100%);'

# DetallesDiaHeader - Azul profundo
$content = $content -replace 'background: linear-gradient\(135deg, #1E3A8A 0%, #3B82F6 100%\);', 'background: linear-gradient(135deg, #0C1E3A 0%, #1E40AF 100%);'

# SeccionMovimientos - Degradados mejorados
$content = $content -replace 'background: linear-gradient\(135deg, #2563EB 0%, #60A5FA 100%\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #3B82F6 0%, #93C5FD 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);'

# Botones Ver específicos 
$content = $content -replace 'background: linear-gradient\(135deg, #2563EB 0%, #1E40AF 100%\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #3B82F6 0%, #2563EB 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);'

# Backgrounds azules
$content = $content -replace 'background: #60A5FA;', 'background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);'

# Color de texto de títulos
$content = $content -replace 'color: #2563EB;', 'color: #1E3A8A;'

# Bordes más oscuros
$content = $content -replace 'border-bottom: 2px solid #3B82F6;', 'border-bottom: 3px solid #1E40AF;'
$content = $content -replace 'border: 3px solid #3B82F6;', 'border: 3px solid #1E40AF;'

# Sombras más pronunciadas
$content = $content -replace 'box-shadow: 0 4px 12px rgba\(37, 99, 235, 0\.5\);', 'box-shadow: 0 6px 20px rgba(12, 30, 58, 0.4);'
$content = $content -replace 'box-shadow: 0 2px 8px rgba\(37, 99, 235, 0\.3\);', 'box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Azul oscuro con degradados aplicado!" -ForegroundColor Green
