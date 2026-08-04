using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;

namespace WebClases.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeacherController : ControllerBase
{
    private readonly ITeacherProfileService _profileService;

    public TeacherController(ITeacherProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<TeacherProfileDto>> GetProfile()
    {
        var profile = await _profileService.GetProfileAsync();
        return Ok(profile);
    }

    [HttpGet("lessons")]
    public async Task<ActionResult<List<LessonTypeDto>>> GetLessonTypes()
    {
        var lessons = await _profileService.GetLessonTypesAsync();
        return Ok(lessons);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("profile")]
    public async Task<ActionResult<TeacherProfileDto>> UpdateProfile(
        [FromBody] UpdateTeacherProfileRequest request)
    {
        var profile = await _profileService.UpdateProfileAsync(request);
        return Ok(profile);
    }
}
