$templatesDir = "C:\1 . project\Placement Prediction\src\main\resources\templates"
$skipFiles = @("index.html")

Get-ChildItem -Path $templatesDir -Recurse -Filter *.html | ForEach-Object {
    if ($skipFiles -notcontains $_.Name) {
        $content = Get-Content $_.FullName -Raw
        $original = $content
        
        # 1. Swap CSS
        $content = $content -replace 'global-theme\.css', 'corporate-theme.css'
        
        # 2. Remove webgl-canvas
        $content = $content -replace '<canvas id="webgl-canvas"></canvas>\s*', ''
        
        # 3. Swap card classes
        $content = $content -replace 'glass-card-premium', 'corporate-card'
        
        # 4. Remove bg-transparent
        $content = $content -replace 'bg-transparent', ''
        
        # 5. Fix border colors from variables
        $content = $content -replace 'var\(--glass-border\)', 'var(--border-color)'
        
        # 6. Remove inline styles for background rgba
        $content = [regex]::Replace($content, 'style="background:\s*rgba\([^)]+\);\s*backdrop-filter:\s*blur\([^)]+\);\s*border:[^"]+"', '')
        $content = [regex]::Replace($content, 'style="background:\s*rgba\([^)]+\);\s*border:[^"]+"', '')
        
        if ($content -cne $original) {
            Set-Content -Path $_.FullName -Value $content -Encoding UTF8
            Write-Host "Updated $($_.FullName)"
        }
    }
}
Write-Host "Migration script completed."
