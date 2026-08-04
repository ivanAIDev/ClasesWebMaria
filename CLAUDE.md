# WebClases — Plataforma de Clases Particulares

## Estructura
- `backend/` — .NET 8 solution con Clean Architecture (API, Application, Domain, Infrastructure)
- `frontend/` — Angular 18 con standalone components y SCSS

## Comandos
- Build backend: `dotnet build WebClases.sln`
- Run backend: `cd backend/WebClases.API && dotnet run` (puerto 5000)
- Build frontend: `cd frontend && npx ng build`
- Run frontend: `cd frontend && npx ng serve` (puerto 4200)

## Base de datos
- SQLite local (`webclases.db`), se auto-crea y seedea al iniciar el backend
- EF Core 8 como ORM

## Autenticación
- JWT Bearer tokens, key en appsettings.json
- Roles: Student, Admin
- Admin seed: maria@webclases.com / Admin123!

## Convenciones
- Backend: C# records para DTOs, async/await, Clean Architecture
- Frontend: Angular signals, standalone components, lazy-loaded routes
- Estilos: SCSS con variables compartidas ($primary: #e17055)
