using WebClases.Application.DTOs;
using WebClases.Domain.Enums;

namespace WebClases.Application.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(Guid studentId, CreateBookingRequest request);
    Task<BookingDto> GetBookingByIdAsync(Guid bookingId);
    Task<List<BookingDto>> GetBookingsByStudentAsync(Guid studentId);
    Task<List<BookingDto>> GetAllBookingsAsync(DateOnly? from = null, DateOnly? to = null, BookingStatus? status = null);
    Task<BookingDto> UpdateBookingStatusAsync(Guid bookingId, UpdateBookingStatusRequest request);
    Task CancelBookingAsync(Guid bookingId, Guid userId, string? reason);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
