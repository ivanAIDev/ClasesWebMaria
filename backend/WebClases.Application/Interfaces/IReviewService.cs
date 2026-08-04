using WebClases.Application.DTOs;

namespace WebClases.Application.Interfaces;

public interface IReviewService
{
    Task<ReviewDto> CreateReviewAsync(Guid studentId, CreateReviewRequest request);
    Task<List<ReviewDto>> GetApprovedReviewsAsync();
    Task<List<ReviewDto>> GetAllReviewsAsync();
    Task ApproveReviewAsync(Guid reviewId);
    Task DeleteReviewAsync(Guid reviewId);
    Task<(double Average, int Count)> GetRatingStatsAsync();
}
