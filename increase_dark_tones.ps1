# Script para reducir mas los tonos claros y aumentar los oscuros

$cssFile = "src\index.css"

# Leer el contenido del archivo
$content = Get-Content $cssFile -Raw

# 1. Reemplazar el azul medio (#2563EB) por azul oscuro (#1E40AF) en varias partes
$content = $content -replace 'radial-gradient\(circle at top left, #2563EB 0%, #2563EB 40%, #1E40AF 70%, #1E3A8A 100%\)', 'radial-gradient(circle at top left, #1E40AF 0%, #1E3A8A 50%, #1E3A8A 100%)'

# 2. Hacer el formulario aun mas oscuro
$content = $content -replace 'radial-gradient\(circle at top right, #2563EB 0%, #1E40AF 40%, #1E3A8A 70%, #1E3A8A 100%\)', 'radial-gradient(circle at top right, #1E40AF 0%, #1E3A8A 50%, #1E3A8A 100%)'

# 3. Cambiar botones de tonos medios a oscuros
$content = $content -replace 'linear-gradient\(135deg, #1E40AF 0%, #1E40AF 100%\)', 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)'

# 4. Hacer el hover de botones mas oscuro
$content = $content -replace 'linear-gradient\(135deg, #1E40AF 0%, #2563EB 100%\)', 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)'

# 5. Cambiar Capital de oscuro a mas oscuro
$content = $content -replace 'background: #1E40AF;', 'background: #1E3A8A;'

# 6. Cambiar sombras de botones de claro a oscuro
$content = $content -replace 'box-shadow: 0 4px 12px rgba\(64, 224, 208, 0.3\);', 'box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4);'
$content = $content -replace 'box-shadow: 0 6px 16px rgba\(64, 224, 208, 0.5\);', 'box-shadow: 0 6px 16px rgba(30, 58, 138, 0.6);'

# 7. Reducir mas el tono claro de labels a un tono medio-claro
$content = $content -replace '#DBEAFE', '#BFDBFE'

# Guardar los cambios
$content | Set-Content $cssFile -NoNewline

Write-Host "Tonos claros reducidos y oscuros aumentados" -ForegroundColor Green
