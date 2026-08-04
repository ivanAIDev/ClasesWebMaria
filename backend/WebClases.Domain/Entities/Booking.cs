using WebClases.Domain.Enums;

namespace WebClases.Domain.Entities;

public class Booking : BaseEntity
{
    public Guid StudentId { get; set; }
    public Guid LessonTypeId { get; set; }
    public DateOnly Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string? StudentNotes { get; set; }
    public string? TeacherNotes { get; set; }
    public decimal Price { get; set; }
    public string? MeetingLink { get; set; }
    public string? CancellationReason { get; set; }

    // Navigation
    public User Student { get; set; } = null!;
    public LessonType LessonType { get; set; } = null!;
}
