using WebClases.Domain.Enums;

namespace WebClases.Domain.Entities;

public class TeacherProfile : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string? VideoIntroUrl { get; set; }
    public decimal PricePerHourSpanish { get; set; }
    public decimal PricePerHourEnglish { get; set; }
    public LessonModality Modality { get; set; } = LessonModality.Both;
    public string? Location { get; set; }
    public int YearsOfExperience { get; set; }
    public string? Qualifications { get; set; }
    public string? SpecialtyDescription { get; set; }

    // SEO & public info
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation
    public ICollection<Availability> Availabilities { get; set; } = new List<Availability>();
    public ICollection<LessonType> LessonTypes { get; set; } = new List<LessonType>();
}
