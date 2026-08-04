# 📚 MaríaClases — Plataforma de Clases Particulares

Aplicación web completa para gestión de clases particulares de español e inglés.
Backend en **.NET 8** y frontend en **Angular 18**.

## 🏗️ Arquitectura

```
WebMaria/
├── backend/
│   ├── WebClases.API/            # API REST + SignalR
│   ├── WebClases.Application/    # DTOs, interfaces, lógica de negocio
│   ├── WebClases.Domain/         # Entidades y enums del dominio
│   └── WebClases.Infrastructure/ # EF Core, servicios, datos
├── frontend/                     # Angular 18 SPA
├── start-backend.ps1             # Script arranque backend
└── start-frontend.ps1            # Script arranque frontend
```

## 🚀 Inicio Rápido

### Requisitos
- .NET 8 SDK
- Node.js 22+
- Angular CLI (`npm install -g @angular/cli@18`)

### Arrancar en desarrollo

**Terminal 1 — Backend:**
```powershell
cd backend/WebClases.API
dotnet run
# API → http://localhost:5000
# Swagger → http://localhost:5000/swagger
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
ng serve
# App → http://localhost:4200
```

### Credenciales de prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin/Profesora | maria@webclases.com | Admin123! |
| Estudiante | carlos@example.com | Student123! |

## ✨ Funcionalidades

- 🏠 **Landing page** profesional con información de la profesora
- 📅 **Sistema de reservas** con calendario de disponibilidad en tiempo real
- 🔐 **Autenticación JWT** (registro/login de estudiantes)
- 📊 **Panel de administración** para la profesora
- ⭐ **Sistema de reseñas** con aprobación por la profesora
- 📡 **SignalR** para actualización de disponibilidad en tiempo real
- 📱 **Diseño responsive** para móvil, tablet y escritorio
- 🇪🇸🇬🇧 Clases de español e inglés con múltiples modalidades

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Backend | ASP.NET Core 8 Web API |
| Frontend | Angular 18 (Standalone Components) |
| Base de datos | SQLite (desarrollo) |
| Autenticación | JWT Bearer Tokens |
| Tiempo real | SignalR |
| ORM | Entity Framework Core 8 |
| Estilos | SCSS personalizado |

## 📁 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de estudiante |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/teacher/profile` | Perfil de la profesora |
| GET | `/api/teacher/lessons` | Tipos de clases |
| GET | `/api/availability/slots` | Horarios disponibles |
| POST | `/api/bookings` | Crear reserva |
| GET | `/api/bookings/my` | Mis reservas |
| GET | `/api/reviews` | Reseñas aprobadas |
| GET | `/api/bookings/dashboard` | Dashboard admin |
