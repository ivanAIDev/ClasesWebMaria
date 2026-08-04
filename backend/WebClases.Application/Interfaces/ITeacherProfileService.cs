using WebClases.Application.DTOs;

namespace WebClases.Application.Interfaces;

public interface ITeacherProfileService
{
    Task<TeacherProfileDto> GetProfileAsync();
    Task<TeacherProfileDto> UpdateProfileAsync(UpdateTeacherProfileRequest request);
    Task<List<LessonTypeDto>> GetLessonTypesAsync();
}
