using WebClases.Domain.Enums;

namespace WebClases.Application.DTOs;

public record TeacherProfileDto(
    Guid Id,
    string Title,
    string Bio,
    string? ProfileImageUrl,
    string? VideoIntroUrl,
    decimal PricePerHourSpanish,
    decimal PricePerHourEnglish,
    decimal CzkEurRate,
    LessonModality Modality,
    string? Location,
    int YearsOfExperience,
    string? Qualifications,
    string? SpecialtyDescription,
    List<LessonTypeDto> LessonTypes,
    double AverageRating,
    int TotalReviews
);

public record LessonTypeDto(
    Guid Id,
    string Name,
    string Description,
    Language Language,
    int DurationMinutes,
    decimal Price,
    decimal PriceCzk,
    LessonModality Modality,
    string? Icon,
    int SortOrder
);

public record UpdateTeacherProfileRequest(
    string Title,
    string Bio,
    string? ProfileImageUrl,
    string? VideoIntroUrl,
    decimal PricePerHourSpanish,
    decimal PricePerHourEnglish,
    LessonModality Modality,
    string? Location,
    int YearsOfExperience,
    string? Qualifications,
    string? SpecialtyDescription
);

public record DashboardStatsDto(
    int TotalBookingsThisMonth,
    int PendingBookings,
    int CompletedBookings,
    decimal RevenueThisMonth,
    int TotalStudents,
    double AverageRating,
    List<BookingDto> UpcomingBookings
);
