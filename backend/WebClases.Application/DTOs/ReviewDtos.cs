namespace WebClases.Application.DTOs;

public record CreateReviewRequest(
    int Rating,
    string Comment
);

public record ReviewDto(
    Guid Id,
    string StudentName,
    int Rating,
    string Comment,
    bool IsApproved,
    DateTime CreatedAt
);
