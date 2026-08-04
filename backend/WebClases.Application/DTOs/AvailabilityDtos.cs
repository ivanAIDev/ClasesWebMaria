namespace WebClases.Application.DTOs;

public record AvailabilityDto(
    Guid Id,
    DayOfWeek DayOfWeek,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsRecurring,
    DateOnly? SpecificDate,
    bool IsBlocked
);

public record CreateAvailabilityRequest(
    DayOfWeek DayOfWeek,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsRecurring = true,
    DateOnly? SpecificDate = null,
    bool IsBlocked = false
);

public record TimeSlotDto(
    DateOnly Date,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsAvailable
);

public record WeekAvailabilityRequest(
    DateOnly StartDate,
    int DurationMinutes = 60
);
