using Microsoft.EntityFrameworkCore;
using WebClases.Domain.Entities;
using WebClases.Domain.Enums;

namespace WebClases.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.TeacherProfiles.AnyAsync())
            return; // Already seeded

        var teacherProfileId = Guid.NewGuid();

        // Create teacher profile
        var teacherProfile = new TeacherProfile
        {
            Id = teacherProfileId,
            Title = "Profesora de Español e Inglés — Clases Particulares Personalizadas",
            Bio = "¡Hola! Soy María Jesús, profesora titulada con más de 8 años de experiencia " +
                  "enseñando español e inglés a alumnos de todas las edades y niveles. " +
                  "Vivo en Praga y doy todas mis clases 100% online. " +
                  "Mi método se adapta a cada estudiante: desde preparación de exámenes oficiales " +
                  "(DELE, Cambridge, TOEFL) hasta conversación fluida y clases para empresas. " +
                  "Creo en un aprendizaje dinámico, divertido y eficaz. ¡Te espero en clase!",
            PricePerHourSpanish = 20.00m,
            PricePerHourEnglish = 22.00m,
            CzkEurRate = 25.0m,
            Modality = LessonModality.Online,
            Location = "Praga, República Checa",
            YearsOfExperience = 8,
            Qualifications = "Grado en Filología Hispánica, Certificado TEFL, Cambridge C2 Proficiency",
            SpecialtyDescription = "Preparación de exámenes oficiales, conversación, español para extranjeros, inglés de negocios",
            MetaTitle = "Clases Particulares de Español e Inglés | María Jesús — Profesora Titulada",
            MetaDescription = "Reserva clases particulares de español e inglés con María Jesús. Clases 100% online. Todos los niveles. Primera clase de prueba gratuita."
        };

        context.TeacherProfiles.Add(teacherProfile);

        // Create lesson types
        var lessonTypes = new List<LessonType>
        {
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Español General",
                Description = "Clases de español adaptadas a tu nivel. Gramática, vocabulario, lectura y expresión oral.",
                Language = Language.Spanish,
                DurationMinutes = 60,
                Price = 20.00m,
                PriceCzk = 500.00m,
                Modality = LessonModality.Online,
                Icon = "🇪🇸",
                SortOrder = 1
            },
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Inglés General",
                Description = "Mejora tu inglés con clases dinámicas. Speaking, listening, reading y writing.",
                Language = Language.English,
                DurationMinutes = 60,
                Price = 22.00m,
                PriceCzk = 550.00m,
                Modality = LessonModality.Online,
                Icon = "🇬🇧",
                SortOrder = 2
            },
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Preparación DELE",
                Description = "Prepárate para los exámenes DELE con material oficial y simulacros de examen.",
                Language = Language.Spanish,
                DurationMinutes = 90,
                Price = 30.00m,
                PriceCzk = 750.00m,
                Modality = LessonModality.Online,
                Icon = "📝",
                SortOrder = 3
            },
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Preparación Cambridge",
                Description = "FCE, CAE, CPE — Preparación intensiva para los exámenes de Cambridge.",
                Language = Language.English,
                DurationMinutes = 90,
                Price = 30.00m,
                PriceCzk = 750.00m,
                Modality = LessonModality.Online,
                Icon = "🎓",
                SortOrder = 4
            },
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Conversación",
                Description = "Sesiones 100% de conversación para ganar fluidez y confianza al hablar.",
                Language = Language.Spanish,
                DurationMinutes = 45,
                Price = 15.00m,
                PriceCzk = 375.00m,
                Modality = LessonModality.Online,
                Icon = "💬",
                SortOrder = 5
            },
            new()
            {
                TeacherProfileId = teacherProfileId,
                Name = "Inglés de Negocios",
                Description = "Vocabulario profesional, emails, presentaciones y reuniones en inglés.",
                Language = Language.English,
                DurationMinutes = 60,
                Price = 25.00m,
                PriceCzk = 625.00m,
                Modality = LessonModality.Online,
                Icon = "💼",
                SortOrder = 6
            }
        };

        context.LessonTypes.AddRange(lessonTypes);

        // Create weekly availability (Monday to Friday)
        var availabilities = new List<Availability>();
        var weekdays = new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday };

        foreach (var day in weekdays)
        {
            // Morning block: 9:00 - 14:00
            availabilities.Add(new Availability
            {
                TeacherProfileId = teacherProfileId,
                DayOfWeek = day,
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(14, 0, 0),
                IsRecurring = true
            });

            // Afternoon block: 16:00 - 20:00
            availabilities.Add(new Availability
            {
                TeacherProfileId = teacherProfileId,
                DayOfWeek = day,
                StartTime = new TimeSpan(16, 0, 0),
                EndTime = new TimeSpan(20, 0, 0),
                IsRecurring = true
            });
        }

        // Saturday morning
        availabilities.Add(new Availability
        {
            TeacherProfileId = teacherProfileId,
            DayOfWeek = DayOfWeek.Saturday,
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(14, 0, 0),
            IsRecurring = true
        });

        context.Availabilities.AddRange(availabilities);

        // Create admin/teacher user
        var adminUser = new User
        {
            FirstName = "María Jesús",
            LastName = "",
            Email = "maria@webclases.com",
            PasswordHash = BCryptHelper.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            Phone = "+420 612 345 678"
        };

        context.Users.Add(adminUser);

        // Create sample student
        var sampleStudent = new User
        {
            FirstName = "Carlos",
            LastName = "López",
            Email = "carlos@example.com",
            PasswordHash = BCryptHelper.HashPassword("Student123!"),
            Role = UserRole.Student,
            Phone = "+34 698 765 432"
        };

        context.Users.Add(sampleStudent);

        // Create sample reviews
        var reviews = new List<Review>
        {
            new()
            {
                StudentId = sampleStudent.Id,
                Rating = 5,
                Comment = "María es una profesora increíble. En solo 3 meses he mejorado muchísimo mi nivel de inglés. Sus clases son dinámicas y siempre adaptadas a mis necesidades.",
                IsApproved = true,
                IsVisible = true
            },
            new()
            {
                StudentId = sampleStudent.Id,
                Rating = 5,
                Comment = "Excelente preparación para el DELE B2. Aprobé a la primera gracias a sus clases y material. ¡Muy recomendable!",
                IsApproved = true,
                IsVisible = true
            },
            new()
            {
                StudentId = sampleStudent.Id,
                Rating = 4,
                Comment = "Clases muy amenas y bien estructuradas. María tiene mucha paciencia y explica de forma muy clara.",
                IsApproved = true,
                IsVisible = true
            }
        };

        context.Reviews.AddRange(reviews);

        await context.SaveChangesAsync();
    }
}

/// <summary>
/// Simple BCrypt-like password helper using built-in HMACSHA256.
/// In production, use a proper BCrypt/Argon2 library.
/// </summary>
public static class BCryptHelper
{
    public static string HashPassword(string password)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA256();
        var salt = Convert.ToBase64String(hmac.Key);
        var hash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
        return $"{salt}:{hash}";
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split(':');
        if (parts.Length != 2) return false;

        var key = Convert.FromBase64String(parts[0]);
        using var hmac = new System.Security.Cryptography.HMACSHA256(key);
        var computedHash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
        return computedHash == parts[1];
    }
}
