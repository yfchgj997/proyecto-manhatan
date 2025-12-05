$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$loginPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\componentes\login.html"

Write-Host "🎨 Cambiando colores a AZUL HERMOSO..." -ForegroundColor Cyan

# Leer archivos
$css = Get-Content $cssPath -Raw -Encoding UTF8
$login = Get-Content $loginPath -Raw -Encoding UTF8

# ============= CAMBIOS DE COLOR SIMPLES =============

# Turquesa oscuro -> Azul royal
$css = $css -replace '#178582', '#1E40AF'
$login = $login -replace '#178582', '#1E40AF'

# Turquesa medio -> Azul vibrante
$css = $css -replace '#40E0D0', '#3B82F6'
$login = $login -replace '#40E0D0', '#3B82F6'

# Turquesa claro -> Azul claro
$css = $css -replace '#7FFFD4', '#60A5FA'
$login = $login -replace '#7FFFD4', '#60A5FA'

# Verde -> Azul cyan (para variedad)
$css = $css -replace '#00838f', '#2563EB'
$css = $css -replace '#006064', '#1E40AF'
$css = $css -replace '#0097a7', '#3B82F6'

# Guardar
$css | Out-File $cssPath -Encoding UTF8 -NoNewline
$login | Out-File $loginPath -Encoding UTF8 -NoNewline

Write-Host "✅ Colores cambiados a azul hermoso!" -ForegroundColor Green
Write-Host "   Turquesa #178582 -> Azul royal #1E40AF" -ForegroundColor Blue
Write-Host "   Turquesa #40E0D0 -> Azul vibrante #3B82F6" -ForegroundColor Blue
Write-Host "   Turquesa #7FFFD4 -> Azul claro #60A5FA" -ForegroundColor Blue
