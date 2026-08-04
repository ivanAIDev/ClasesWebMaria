using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebClases.API.Hubs;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;

namespace WebClases.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;
    private readonly IHubContext<AvailabilityHub> _hubContext;

    public AvailabilityController(
        IAvailabilityService availabilityService,
        IHubContext<AvailabilityHub> hubContext)
    {
        _availabilityService = availabilityService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<AvailabilityDto>>> GetAll()
    {
        var availabilities = await _availabilityService.GetAllAvailabilitiesAsync();
        return Ok(availabilities);
    }

    [HttpGet("slots")]
    public async Task<ActionResult<List<TimeSlotDto>>> GetSlots(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        [FromQuery] int durationMinutes = 60)
    {
        var slots = await _availabilityService.GetAvailableSlotsAsync(startDate, endDate, durationMinutes);
        return Ok(slots);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<AvailabilityDto>> Create([FromBody] CreateAvailabilityRequest request)
    {
        var result = await _availabilityService.CreateAvailabilityAsync(request);
        await NotifyAvailabilityChange();
        return CreatedAtAction(nameof(GetAll), result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<AvailabilityDto>> Update(
        Guid id, [FromBody] CreateAvailabilityRequest request)
    {
        var result = await _availabilityService.UpdateAvailabilityAsync(id, request);
        await NotifyAvailabilityChange();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _availabilityService.DeleteAvailabilityAsync(id);
        await NotifyAvailabilityChange();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("block")]
    public async Task<ActionResult> BlockSlot(
        [FromQuery] DateOnly date,
        [FromQuery] TimeSpan startTime,
        [FromQuery] TimeSpan endTime)
    {
        await _availabilityService.BlockSlotAsync(date, startTime, endTime);
        await NotifyAvailabilityChange();
        return Ok();
    }

    private async Task NotifyAvailabilityChange()
    {
        await _hubContext.Clients.Group("availability")
            .SendAsync("AvailabilityUpdated");
    }
}
