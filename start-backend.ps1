# Start WebClases Backend API on port 5000
Write-Host "🚀 Iniciando WebClases API en http://localhost:5000" -ForegroundColor Green
Write-Host "📖 Swagger UI: http://localhost:5000/swagger" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\backend\WebClases.API"
dotnet run
