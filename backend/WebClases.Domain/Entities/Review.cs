namespace WebClases.Domain.Entities;

public class Review : BaseEntity
{
    public Guid StudentId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    public bool IsVisible { get; set; } = true;

    // Navigation
    public User Student { get; set; } = null!;
}
