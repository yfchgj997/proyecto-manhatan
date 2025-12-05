$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 Aplicando Paleta Azul Corporativa Profesional..." -ForegroundColor Cyan

# ===================================================
# PALETA AZUL CORPORATIVA PROFESIONAL
# ===================================================

# ============= MENÚ LATERAL - AZUL OSCURO =============
$content = $content -replace 'background: linear-gradient\(180deg, #0A1828 0%, #2C3E50 100%\);', 'background: #1E3A8A;'

# ============= TEXTO REDSUR - BLANCO =============
$content = $content -replace 'color: #40E0D0;', 'color: #FFFFFF;'
$content = $content -replace 'text-shadow: 0 2px 8px rgba\(64, 224, 208, 0\.3\);', 'text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);'

# Bienvenida - Blanco suave
$content = $content -replace 'color: #7FFFD4;', 'color: #E5E7EB;'

# ============= MENU ITEMS - AZUL CORPORATIVO =============
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.3\) 100%\);', 'background: rgba(26, 86, 219, 0.15);'
$content = $content -replace 'border-left: 4px solid #40E0D0;', 'border-left: 4px solid #1A56DB;'

# Active
$content = $content -replace 'background: linear-gradient\(90deg, #178582 0%, rgba\(64, 224, 208, 0\.4\) 100%\);', 'background: #1A56DB;'
$content = $content -replace 'border-left: 4px solid #7FFFD4;', 'border-left: 4px solid #FFFFFF;'

# ============= BOTÓN SALIR - ROJO ALERTA =============
$content = $content -replace 'background: linear-gradient\(135deg, #dc3545 0%, #c82333 100%\);', 'background: #EF4444;'

# ============= ENCABEZADO - FONDO CLARO =============
$content = $content -replace 'border-bottom: solid 3px #178582;', 'border-bottom: solid 3px #1A56DB;'
$content = $content -replace 'background: linear-gradient\(90deg, rgba\(23, 133, 130, 0\.05\) 0%, transparent 100%\);', 'background: #FFFFFF;'

# Título - Negro principal
$content = $content -replace 'color: black;', 'color: #111827;'

# ============= FORMULARIOS - FONDO CLARO =============
$content = $content -replace 'background: linear-gradient\(135deg, #2C3E50 0%, #34495E 100%\);', 'background: #F8FAFC;'

# ============= INPUTS - BLANCO =============
$content = $content -replace 'background: white;', 'background: #FFFFFF; border: 1px solid #E5E7EB;'
$content = $content -replace 'color: gray;', 'color: #6B7280;'

# ============= BUSCADORES - FONDO CLARO =============
$content = $content -replace 'background: #F5F5F5;', 'background: #FFFFFF;'
$content = $content -replace 'border: solid black 1px;', 'border: 1px solid #E5E7EB;'

# ============= BOTONES - AZUL CORPORATIVO =============
$content = $content -replace 'background: #007bff;', 'background: #1A56DB;'
$content = $content -replace 'background: linear-gradient\(135deg, #178582 0%, #40E0D0 100%\);', 'background: #1A56DB;'

# Hover
$content = $content -replace 'background: linear-gradient\(135deg, #40E0D0 0%, #7FFFD4 100%\);', 'background: #1E3A8A;'
$content = $content -replace 'box-shadow: 0 6px 16px rgba\(64, 224, 208, 0\.5\);', 'box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);'

# ============= CAPITAL - AZUL CORPORATIVO =============
$content = $content -replace 'background: #449eff;', 'background: #1A56DB;'

# ============= BOTONES CODE - AZUL =============
$content = $content -replace 'background-color: #4aa3ff;', 'background: #1A56DB;'
$content = $content -replace 'background-color: #1b82e9;', 'background: #1E3A8A;'

# ============= CONTENEDOR MOVIMIENTOS - BLANCO =============
$content = $content -replace 'background: white;', 'background: #FFFFFF; border: 1px solid #E5E7EB;'

# ============= TABLA HEADERS - AZUL CORPORATIVO =============
$content = $content -replace 'background: #52a5ff;', 'background: #1A56DB;'

# Hover filas
$content = $content -replace 'background-color: #f4f9ff;', 'background: #F8FAFC;'

# ============= BOTONES VER - AZUL =============
$content = $content -replace 'background: linear-gradient\(135deg, #8B5CF6 0%, #A78BFA 100%\);', 'background: #1A56DB;'
$content = $content -replace 'background: linear-gradient\(135deg, #7C3AED 0%, #8B5CF6 100%\);', 'background: #1E3A8A;'
$content = $content -replace 'box-shadow: 0 2px 8px rgba\(139, 92, 246, 0\.3\);', 'box-shadow: 0 2px 8px rgba(26, 86, 219, 0.3);'
$content = $content -replace 'box-shadow: 0 4px 12px rgba\(139, 92, 246, 0\.5\);', 'box-shadow: 0 4px 12px rgba(26, 86, 219, 0.4);'

# ============= MODAL - FONDO CLARO =============
$content = $content -replace 'background: rgba\(0, 0, 0, 0\.7\);', 'background: rgba(17, 24, 39, 0.75);'
$content = $content -replace 'background: white;', 'background: #FFFFFF;'

# ============= MODAL HEADER - AZUL =============
$content = $content -replace 'background: linear-gradient\(135deg, #007bff 0%, #178582 100%\);', 'background: #1A56DB;'

# ============= SECCIONES - FONDO CLARO =============
$content = $content -replace 'background: #F9FAFB;', 'background: #F8FAFC;'

# Títulos secciones
$content = $content -replace 'color: #007bff;', 'color: #1A56DB;'
$content = $content -replace 'border-bottom: 2px solid #8B5CF6;', 'border-bottom: 2px solid #1A56DB;'

# ============= TABLA MOVIMIENTOS =============
$content = $content -replace 'color: #374151;', 'color: #111827;'
$content = $content -replace 'background: #F3F4F6;', 'background: #F8FAFC;'
$content = $content -replace 'color: #9CA3AF;', 'color: #6B7280;'

# ============= BOTONES VER ESPECÍFICOS =============
$content = $content -replace 'background: linear-gradient\(135deg, #00838f 0%, #006064 100%\);', 'background: #1A56DB;'
$content = $content -replace 'background: linear-gradient\(135deg, #0097a7 0%, #00838f 100%\);', 'background: #1E3A8A;'

# ============= BADGES - VERDE ÉXITO / ROJO ALERTA =============
$content = $content -replace 'background-color: #10b981;', 'background: #10B981;'
$content = $content -replace 'background-color: #ef4444;', 'background: #EF4444;'

# ============= BOTÓN VER AZUL =============
$content = $content -replace 'background-color: #007bff;', 'background: #1A56DB;'
$content = $content -replace 'background-color: #0056b3;', 'background: #1E3A8A;'

# ============= BOTÓN DESCARGAR - VERDE =============
# Ya está en #10B981 (verde éxito)

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ Paleta Azul Corporativa Aplicada!" -ForegroundColor Green
Write-Host "   • Azul Corporativo: #1A56DB (botones, acentos)" -ForegroundColor Cyan
Write-Host "   • Azul Oscuro: #1E3A8A (menú, hover)" -ForegroundColor Cyan
Write-Host "   • Blanco: #FFFFFF (fondos)" -ForegroundColor Cyan
Write-Host "   • Gris Claro: #F8FAFC (fondos alternos)" -ForegroundColor Cyan
Write-Host "   • Verde Éxito: #10B981 (confirmaciones)" -ForegroundColor Cyan
Write-Host "   • Rojo Alerta: #EF4444 (advertencias)" -ForegroundColor Cyan
Write-Host "   • Texto: #111827 / #6B7280" -ForegroundColor Cyan
