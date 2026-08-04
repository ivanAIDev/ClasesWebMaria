using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebClases.API.Hubs;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;
using WebClases.Domain.Enums;

namespace WebClases.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly IHubContext<AvailabilityHub> _hubContext;

    public BookingsController(IBookingService bookingService, IHubContext<AvailabilityHub> hubContext)
    {
        _bookingService = bookingService;
        _hubContext = hubContext;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        try
        {
            var booking = await _bookingService.CreateBookingAsync(userId, request);
            await _hubContext.Clients.Group("availability").SendAsync("AvailabilityUpdated");
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetBooking(Guid id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        return Ok(booking);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<List<BookingDto>>> GetMyBookings()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var bookings = await _bookingService.GetBookingsByStudentAsync(userId);
        return Ok(bookings);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<BookingDto>>> GetAllBookings(
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        [FromQuery] BookingStatus? status)
    {
        var bookings = await _bookingService.GetAllBookingsAsync(from, to, status);
        return Ok(bookings);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<ActionResult<BookingDto>> UpdateStatus(
        Guid id, [FromBody] UpdateBookingStatusRequest request)
    {
        var booking = await _bookingService.UpdateBookingStatusAsync(id, request);
        await _hubContext.Clients.Group("availability").SendAsync("AvailabilityUpdated");
        return Ok(booking);
    }

    [Authorize]
    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelBooking(Guid id, [FromBody] string? reason)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _bookingService.CancelBookingAsync(id, userId, reason);
        await _hubContext.Clients.Group("availability").SendAsync("AvailabilityUpdated");
        return Ok(new { message = "Reserva cancelada correctamente." });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboard()
    {
        var stats = await _bookingService.GetDashboardStatsAsync();
        return Ok(stats);
    }
}
