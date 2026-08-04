using WebClases.Domain.Enums;

namespace WebClases.Application.DTOs;

public record CreateBookingRequest(
    Guid LessonTypeId,
    DateOnly Date,
    TimeSpan StartTime,
    string? StudentNotes
);

public record BookingDto(
    Guid Id,
    Guid StudentId,
    string StudentName,
    Guid LessonTypeId,
    string LessonTypeName,
    Language Language,
    DateOnly Date,
    TimeSpan StartTime,
    TimeSpan EndTime,
    BookingStatus Status,
    string? StudentNotes,
    string? TeacherNotes,
    decimal Price,
    string? MeetingLink,
    DateTime CreatedAt
);

public record UpdateBookingStatusRequest(
    BookingStatus Status,
    string? TeacherNotes,
    string? MeetingLink,
    string? CancellationReason
);
