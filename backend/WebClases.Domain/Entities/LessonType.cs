using WebClases.Domain.Enums;

namespace WebClases.Domain.Entities;

public class LessonType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Language Language { get; set; }
    public int DurationMinutes { get; set; } = 60;
    public decimal Price { get; set; }
    public LessonModality Modality { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Icon { get; set; }
    public int SortOrder { get; set; }

    // Navigation
    public Guid TeacherProfileId { get; set; }
    public TeacherProfile TeacherProfile { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
