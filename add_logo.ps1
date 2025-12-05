$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

# Agregar estilos del logo
$logoStyles = @"

/* Logo REDSUR en menú */
.logo-redsur {
    width: 100px;
    height: auto;
    margin: 0 auto 16px auto;
    display: block;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
}
"@

$content += $logoStyles
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Logo agregado al menú!" -ForegroundColor Green
