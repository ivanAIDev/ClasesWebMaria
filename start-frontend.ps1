# Start WebClases Angular Frontend on port 4200
Write-Host "🚀 Iniciando WebClases Frontend en http://localhost:4200" -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
npx ng serve --open
