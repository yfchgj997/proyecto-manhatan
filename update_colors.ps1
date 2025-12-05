$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

# Menú lateral - Background principal
$content = $content -replace 'background: linear-gradient\(180deg, #0A1828 0%, #2C3E50 100%\);', 'background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%);'

# Menu items - hover y active (turquesa a azul)
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.3\) 100%\);', 'background: linear-gradient(90deg, #2563EB 0%, rgba(59, 130, 246, 0.3) 100%);'
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.4\) 100%\);', 'background: linear-gradient(90deg, #1D4ED8 0%, rgba(59, 130, 246, 0.4) 100%);'

# Fondo sutil del encabezado
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(23, 133, 130, 0\.05\) 0%, transparent 100%\);', 'background: linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%);'

# Headers y backgrounds grises/oscuros a azul
$content = $content -replace 'background: linear-gradient\(135deg, #2C3E50 0%, #34495E 100%\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);'

# Botones y elementos con #007bff (ya azul pero actualizamos a nuestro azul)
$content = $content -replace 'background: #007bff;', 'background: #3B82F6;'
$content = $content -replace 'background-color: #007bff;', 'background-color: #3B82F6;'
$content = $content -replace 'color: #007bff;', 'color: #2563EB;'

# Botones azules específicos
$content = $content -replace 'background-color: #4aa3ff;', 'background-color: #3B82F6;'
$content = $content -replace 'background-color: #1b82e9;', 'background-color: #1D4ED8;'
$content = $content -replace 'background-color: #0056b3;', 'background-color: #1E40AF;'

# Headers de tablas azules
$content = $content -replace 'background: #52a5ff;', 'background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);'
$content = $content -replace 'background-color: #f4f9ff;', 'background-color: #EFF6FF;'

# Botones Ver (púrpura a azul)
$content = $content -replace 'background: linear-gradient\(135deg, #8B5CF6 0%, #A78BFA 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #7C3AED 0%, #8B5CF6 100%\);', 'background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);'

# DetallesDiaHeader y modales (turquesa a azul)
$content = $content -replace 'background: linear-gradient\(135deg, #007bff 0%, #178582 100%\);', 'background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);'

# SeccionMovimientos headers (turquesa a azul)
$content = $content -replace 'background: linear-gradient\(135deg, #178582 0%, #40E0D0 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #40E0D0 0%, #7FFFD4 100%\);', 'background: linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%);'

# Botones Ver específicos (turquesa a azul)
$content = $content -replace 'background: linear-gradient\(135deg, #00838f 0%, #006064 100%\);', 'background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);'
$content = $content -replace 'background: linear-gradient\(135deg, #0097a7 0%, #00838f 100%\);', 'background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);'

# Backgrounds de secciones azules claras
$content = $content -replace 'background: #449eff;', 'background: #60A5FA;'

# Bordes azules/turquesa
$content = $content -replace 'border-bottom: 2px solid #8B5CF6;', 'border-bottom: 2px solid #3B82F6;'
$content = $content -replace 'border: 3px solid #178582;', 'border: 3px solid #3B82F6;'
$content = $content -replace 'border: 1px solid #40E0D0;', 'border: 1px solid #60A5FA;'
$content = $content -replace 'box-shadow: 0 4px 12px rgba\(139, 92, 246, 0\.5\);', 'box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);'
$content = $content -replace 'box-shadow: 0 2px 8px rgba\(139, 92, 246, 0\.3\);', 'box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Colores actualizados a esquema azul!" -ForegroundColor Green
