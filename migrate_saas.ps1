$templatesDir = "C:\1 . project\Placement Prediction\src\main\resources\templates"
$skipFiles = @("index.html")

Get-ChildItem -Path $templatesDir -Recurse -Filter *.html | ForEach-Object {
    if ($skipFiles -notcontains $_.Name) {
        $content = Get-Content $_.FullName -Raw
        $original = $content
        
        # 1. Update Stylesheet to saas-orange-theme.css
        $content = $content -replace 'corporate-theme\.css', 'saas-orange-theme.css'
        $content = $content -replace 'global-theme\.css', 'saas-orange-theme.css'
        $content = $content -replace 'dark-saas-theme\.css', 'saas-orange-theme.css'
        
        # 2. Add Loader if missing
        if ($content -notmatch 'loader\.css') {
            $content = $content -replace '</head>', "    <link href=`"/css/loader.css`" rel=`"stylesheet`">`n    <script src=`"/js/loader.js`"></script>`n</head>"
        }
        
        # 3. Chart.js Colors update (Dashboard specifically)
        # Search for chart background colors and borders and replace them with orange gradients
        if ($content -match 'Chart\(') {
            # Standardize pie/doughnut colors
            $content = $content -replace 'backgroundColor: \[[^\]]+\]', "backgroundColor: ['#F59E0B', '#FDBA74', '#FCD34D', '#10B981', '#6366F1', '#3B82F6']"
            $content = $content -replace 'borderColor: \[[^\]]+\]', "borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']"
            
            # Standardize line/bar primary color
            $content = $content -replace "borderColor: 'rgba[^']+'", "borderColor: '#F59E0B'"
            $content = $content -replace "backgroundColor: 'rgba[^']+'", "backgroundColor: 'rgba(245, 158, 11, 0.2)'"
        }
        
        if ($content -cne $original) {
            Set-Content -Path $_.FullName -Value $content -Encoding UTF8
            Write-Host "Migrated $($_.FullName) to SaaS Orange Theme"
        }
    }
}
Write-Host "Migration completed successfully."
