# Script para agregar tonos más oscuros sutiles al diseño azul

$cssFile = "src\index.css"

# Leer el contenido del archivo
$content = Get-Content $cssFile -Raw

# 1. Hacer el menú lateral un poco más oscuro en el gradiente
$content = $content -replace `
    'background: radial-gradient\(circle at top left, #5B9FED 0%, #2563EB 50%, #1E40AF 100%\);', `
    'background: radial-gradient(circle at top left, #5B9FED 0%, #2563EB 40%, #1E40AF 70%, #1E3A8A 100%);'

# 2. Hacer el formulario más oscuro en algunas partes
$content = $content -replace `
    'background: radial-gradient\(circle at top right, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%\);', `
    'background: radial-gradient(circle at top right, #2563EB 0%, #1E40AF 40%, #1E3A8A 70%, #1E3A8A 100%);'

# 3. Hacer el header del modal más oscuro
$content = $content -replace `
    'background: linear-gradient\(135deg, #007bff 0%, #1E40AF 100%\);', `
    'background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);'

# 4. Hacer los headers de tabla dentro del modal más oscuros
$content = $content -replace `
    'background: linear-gradient\(135deg, #007bff 0%, #1E40AF 100%\);', `
    'background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);'

# 5. Oscurecer el borde del encabezado
$content = $content -replace `
    'border-bottom: solid 3px #1E40AF;', `
    'border-bottom: solid 3px #1E3A8A;'

# 6. Oscurecer el hover del menu item
$content = $content -replace `
    'background: linear-gradient\(90deg, #1E40AF 0%, rgba\(64, 224, 208, 0.3\) 100%\);', `
    'background: linear-gradient(90deg, #1E3A8A 0%, rgba(64, 224, 208, 0.3) 100%);'

# 7. Oscurecer el menu item activo
$content = $content -replace `
    'background: linear-gradient\(90deg, #1E40AF 0%, rgba\(64, 224, 208, 0.4\) 100%\);', `
    'background: linear-gradient(90deg, #1E3A8A 0%, rgba(64, 224, 208, 0.4) 100%);'

# Guardar los cambios
$content | Set-Content $cssFile -NoNewline

Write-Host "Tonos mas oscuros aplicados exitosamente" -ForegroundColor Green
