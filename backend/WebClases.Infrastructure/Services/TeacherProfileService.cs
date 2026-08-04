using Microsoft.EntityFrameworkCore;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;
using WebClases.Infrastructure.Data;

namespace WebClases.Infrastructure.Services;

public class TeacherProfileService : ITeacherProfileService
{
    private readonly AppDbContext _context;
    private readonly IReviewService _reviewService;

    public TeacherProfileService(AppDbContext context, IReviewService reviewService)
    {
        _context = context;
        _reviewService = reviewService;
    }

    public async Task<TeacherProfileDto> GetProfileAsync()
    {
        var profile = await _context.TeacherProfiles
            .Include(t => t.LessonTypes.Where(l => l.IsActive))
            .FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Perfil de profesora no encontrado.");

        var (avgRating, totalReviews) = await _reviewService.GetRatingStatsAsync();

        return new TeacherProfileDto(
            profile.Id,
            profile.Title,
            profile.Bio,
            profile.ProfileImageUrl,
            profile.VideoIntroUrl,
            profile.PricePerHourSpanish,
            profile.PricePerHourEnglish,
            profile.Modality,
            profile.Location,
            profile.YearsOfExperience,
            profile.Qualifications,
            profile.SpecialtyDescription,
            profile.LessonTypes.OrderBy(l => l.SortOrder).Select(l => new LessonTypeDto(
                l.Id, l.Name, l.Description, l.Language,
                l.DurationMinutes, l.Price, l.Modality, l.Icon, l.SortOrder
            )).ToList(),
            avgRating,
            totalReviews
        );
    }

    public async Task<TeacherProfileDto> UpdateProfileAsync(UpdateTeacherProfileRequest request)
    {
        var profile = await _context.TeacherProfiles.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Perfil de profesora no encontrado.");

        profile.Title = request.Title;
        profile.Bio = request.Bio;
        profile.ProfileImageUrl = request.ProfileImageUrl;
        profile.VideoIntroUrl = request.VideoIntroUrl;
        profile.PricePerHourSpanish = request.PricePerHourSpanish;
        profile.PricePerHourEnglish = request.PricePerHourEnglish;
        profile.Modality = request.Modality;
        profile.Location = request.Location;
        profile.YearsOfExperience = request.YearsOfExperience;
        profile.Qualifications = request.Qualifications;
        profile.SpecialtyDescription = request.SpecialtyDescription;

        await _context.SaveChangesAsync();

        return await GetProfileAsync();
    }

    public async Task<List<LessonTypeDto>> GetLessonTypesAsync()
    {
        return await _context.LessonTypes
            .Where(l => l.IsActive)
            .OrderBy(l => l.SortOrder)
            .Select(l => new LessonTypeDto(
                l.Id, l.Name, l.Description, l.Language,
                l.DurationMinutes, l.Price, l.Modality, l.Icon, l.SortOrder
            ))
            .ToListAsync();
    }
}
