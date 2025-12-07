# Script para reducir los tonos claros del diseño azul

$cssFile = "src\index.css"

# Leer el contenido del archivo
$content = Get-Content $cssFile -Raw

# 1. Reemplazar tonos azul claro (#5B9FED) por tonos medios (#2563EB)
$content = $content -replace '#5B9FED', '#2563EB'

# 2. Reemplazar tonos azul medio claro (#3B82F6) por tonos medios (#2563EB)
$content = $content -replace '#3B82F6', '#1E40AF'

# 3. Reemplazar tonos azul claro hover (#60A5FA) por tonos medios (#3B82F6)
$content = $content -replace '#60A5FA', '#2563EB'

# 4. Reemplazar el azul claro en labels (#93C5FD) por un tono mas oscuro pero visible
$content = $content -replace '#93C5FD', '#DBEAFE'

# 5. Reemplazar azules claros en Capital
$content = $content -replace 'background: #3B82F6;', 'background: #1E40AF;'

# Guardar los cambios
$content | Set-Content $cssFile -NoNewline

Write-Host "Tonos claros reducidos exitosamente" -ForegroundColor Green
