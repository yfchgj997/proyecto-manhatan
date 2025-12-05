$cssPath = "c:\Users\USER\Downloads\mysoft\proyecto-manhatan\src\index.css"
$content = Get-Content $cssPath -Raw -Encoding UTF8

Write-Host "🎨 REDISEÑO PROFESIONAL COMPLETO..." -ForegroundColor Magenta

# ============= LIMPIEZA TOTAL =============
# Menú - Azul oscuro sólido limpio
$content = $content -replace '#EspacioMenu \{([^}]*)\}', '#EspacioMenu { background: #1E3A8A; width: 280px; height: auto; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.1); }'

# Empresa section - Limpio
$content = $content -replace '#EspacioMenu>.Empresa \{([^}]*)\}', '#EspacioMenu>.Empresa { width: 100%; padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }'

# REDSUR texto - Blanco limpio
$content = $content -replace '#EspacioMenu>.Empresa>h1 \{([^}]*)\}', '#EspacioMenu>.Empresa>h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px; }'

# Bienvenida - Gris claro
$content = $content -replace '#EspacioMenu>.Empresa>p \{([^}]*)\}', '#EspacioMenu>.Empresa>p { color: rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0; }'

# Menu items - Limpio
$content = $content -replace '\.menu-item \{([^}]*)\}', '.menu-item { background: transparent; color: rgba(255,255,255,0.9); padding: 14px 24px; margin: 4px 12px; border-radius: 6px; border-left: 3px solid transparent; transition: all 0.2s; font-weight: 500; }'

# Menu hover
$content = $content -replace '\.menu-item:hover \{([^}]*)\}', '.menu-item:hover { background: rgba(255,255,255,0.1); border-left-color: #FFFFFF; }'

# Menu active  
$content = $content -replace '\.menu-item\.active \{([^}]*)\}', '.menu-item.active { background: #1A56DB; border-left-color: #FFFFFF; color: #FFFFFF; }'

# Exit button
$content = $content -replace '#EspacioMenu>.Botones>.exit-button \{([^}]*)\}', '#EspacioMenu>.Botones>.exit-button { width: 90%; margin: 16px auto; background: #EF4444; color: #FFFFFF; padding: 12px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }'

# Contenido principal
$content = $content -replace '#EspacioContenido \{([^}]*)\}', '#EspacioContenido { width: 100%; height: 100%; flex-grow: 1; display: flex; flex-direction: column; background: #F8FAFC; }'

# Header
$content = $content -replace '\.Encabezado \{([^}]*)\}', '.Encabezado { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: #FFFFFF; border-bottom: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }'

# Título
$content = $content -replace '\.NombreVentana \{([^}]*)\}', '.NombreVentana { color: #111827; font-size: 28px; font-weight: 700; }'

# Guardar
$content | Out-File $cssPath -Encoding UTF8 -NoNewline

Write-Host "✅ REDISEÑO PROFESIONAL COMPLETADO!" -ForegroundColor Green
