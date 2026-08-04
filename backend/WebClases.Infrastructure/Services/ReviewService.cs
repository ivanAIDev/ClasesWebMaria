using Microsoft.EntityFrameworkCore;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;
using WebClases.Domain.Entities;
using WebClases.Infrastructure.Data;

namespace WebClases.Infrastructure.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ReviewDto> CreateReviewAsync(Guid studentId, CreateReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5)
            throw new ArgumentException("La valoración debe ser entre 1 y 5.");

        var review = new Review
        {
            StudentId = studentId,
            Rating = request.Rating,
            Comment = request.Comment,
            IsApproved = false,
            IsVisible = true
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var student = await _context.Users.FindAsync(studentId);
        return new ReviewDto(review.Id, student?.FullName ?? "Anónimo",
            review.Rating, review.Comment, review.IsApproved, review.CreatedAt);
    }

    public async Task<List<ReviewDto>> GetApprovedReviewsAsync()
    {
        return await _context.Reviews
            .Include(r => r.Student)
            .Where(r => r.IsApproved && r.IsVisible)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id, r.Student.FullName,
                r.Rating, r.Comment, r.IsApproved, r.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<List<ReviewDto>> GetAllReviewsAsync()
    {
        return await _context.Reviews
            .Include(r => r.Student)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id, r.Student.FullName,
                r.Rating, r.Comment, r.IsApproved, r.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task ApproveReviewAsync(Guid reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId)
            ?? throw new KeyNotFoundException("Reseña no encontrada.");

        review.IsApproved = true;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteReviewAsync(Guid reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId)
            ?? throw new KeyNotFoundException("Reseña no encontrada.");

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }

    public async Task<(double Average, int Count)> GetRatingStatsAsync()
    {
        var reviews = await _context.Reviews
            .Where(r => r.IsApproved && r.IsVisible)
            .ToListAsync();

        if (!reviews.Any()) return (0, 0);

        return (reviews.Average(r => r.Rating), reviews.Count);
    }
}
