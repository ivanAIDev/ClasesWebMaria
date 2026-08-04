using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;

namespace WebClases.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReviewDto>>> GetApprovedReviews()
    {
        var reviews = await _reviewService.GetApprovedReviewsAsync();
        return Ok(reviews);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<ActionResult<List<ReviewDto>>> GetAllReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();
        return Ok(reviews);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var review = await _reviewService.CreateReviewAsync(userId, request);
        return CreatedAtAction(nameof(GetApprovedReviews), review);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/approve")]
    public async Task<ActionResult> ApproveReview(Guid id)
    {
        await _reviewService.ApproveReviewAsync(id);
        return Ok(new { message = "Reseña aprobada." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        await _reviewService.DeleteReviewAsync(id);
        return NoContent();
    }
}
