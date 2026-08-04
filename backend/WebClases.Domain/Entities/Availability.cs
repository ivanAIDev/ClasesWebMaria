namespace WebClases.Domain.Entities;

public class Availability : BaseEntity
{
    public Guid TeacherProfileId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsRecurring { get; set; } = true;

    /// <summary>
    /// For non-recurring slots, the specific date.
    /// </summary>
    public DateOnly? SpecificDate { get; set; }

    /// <summary>
    /// If true, this slot is blocked (vacation, etc.)
    /// </summary>
    public bool IsBlocked { get; set; } = false;

    // Navigation
    public TeacherProfile TeacherProfile { get; set; } = null!;
}
