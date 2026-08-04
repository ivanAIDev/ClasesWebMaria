using Microsoft.EntityFrameworkCore;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;
using WebClases.Domain.Entities;
using WebClases.Domain.Enums;
using WebClases.Infrastructure.Data;

namespace WebClases.Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;
    private readonly IAvailabilityService _availabilityService;

    public BookingService(AppDbContext context, IAvailabilityService availabilityService)
    {
        _context = context;
        _availabilityService = availabilityService;
    }

    public async Task<BookingDto> CreateBookingAsync(Guid studentId, CreateBookingRequest request)
    {
        var lessonType = await _context.LessonTypes.FindAsync(request.LessonTypeId)
            ?? throw new KeyNotFoundException("Tipo de clase no encontrado.");

        var endTime = request.StartTime + TimeSpan.FromMinutes(lessonType.DurationMinutes);

        // Verify availability
        var slots = await _availabilityService.GetAvailableSlotsAsync(
            request.Date, request.Date, lessonType.DurationMinutes);

        var isSlotAvailable = slots.Any(s =>
            s.Date == request.Date &&
            s.StartTime == request.StartTime &&
            s.IsAvailable);

        if (!isSlotAvailable)
            throw new InvalidOperationException("El horario seleccionado no está disponible.");

        var booking = new Booking
        {
            StudentId = studentId,
            LessonTypeId = request.LessonTypeId,
            Date = request.Date,
            StartTime = request.StartTime,
            EndTime = endTime,
            Status = BookingStatus.Pending,
            StudentNotes = request.StudentNotes,
            Price = lessonType.Price
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return await GetBookingByIdAsync(booking.Id);
    }

    public async Task<BookingDto> GetBookingByIdAsync(Guid bookingId)
    {
        var booking = await _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        return MapToDto(booking);
    }

    public async Task<List<BookingDto>> GetBookingsByStudentAsync(Guid studentId)
    {
        return await _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .Where(b => b.StudentId == studentId)
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.StartTime)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<List<BookingDto>> GetAllBookingsAsync(
        DateOnly? from = null, DateOnly? to = null, BookingStatus? status = null)
    {
        var query = _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .AsQueryable();

        if (from.HasValue)
            query = query.Where(b => b.Date >= from.Value);
        if (to.HasValue)
            query = query.Where(b => b.Date <= to.Value);
        if (status.HasValue)
            query = query.Where(b => b.Status == status.Value);

        var bookings = await query
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.StartTime)
            .ToListAsync();

        return bookings.Select(MapToDto).ToList();
    }

    public async Task<BookingDto> UpdateBookingStatusAsync(Guid bookingId, UpdateBookingStatusRequest request)
    {
        var booking = await _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        booking.Status = request.Status;
        if (request.TeacherNotes != null) booking.TeacherNotes = request.TeacherNotes;
        if (request.MeetingLink != null) booking.MeetingLink = request.MeetingLink;
        if (request.CancellationReason != null) booking.CancellationReason = request.CancellationReason;

        await _context.SaveChangesAsync();

        return MapToDto(booking);
    }

    public async Task CancelBookingAsync(Guid bookingId, Guid userId, string? reason)
    {
        var booking = await _context.Bookings.FindAsync(bookingId)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        if (booking.StudentId != userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.Role != UserRole.Admin)
                throw new UnauthorizedAccessException("No tienes permiso para cancelar esta reserva.");
        }

        if (booking.Status == BookingStatus.Cancelled)
            throw new InvalidOperationException("Esta reserva ya está cancelada.");

        booking.Status = BookingStatus.Cancelled;
        booking.CancellationReason = reason;
        await _context.SaveChangesAsync();
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var now = DateTime.UtcNow;
        var firstDayOfMonth = new DateOnly(now.Year, now.Month, 1);
        var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
        var today = DateOnly.FromDateTime(now);

        var monthBookings = await _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .Where(b => b.Date >= firstDayOfMonth && b.Date <= lastDayOfMonth)
            .ToListAsync();

        var upcomingBookings = await _context.Bookings
            .Include(b => b.Student)
            .Include(b => b.LessonType)
            .Where(b => b.Date >= today && b.Status != BookingStatus.Cancelled)
            .OrderBy(b => b.Date)
            .ThenBy(b => b.StartTime)
            .Take(10)
            .ToListAsync();

        var totalStudents = await _context.Users
            .Where(u => u.Role == UserRole.Student)
            .CountAsync();

        var reviews = await _context.Reviews
            .Where(r => r.IsApproved)
            .ToListAsync();

        var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

        return new DashboardStatsDto(
            TotalBookingsThisMonth: monthBookings.Count,
            PendingBookings: monthBookings.Count(b => b.Status == BookingStatus.Pending),
            CompletedBookings: monthBookings.Count(b => b.Status == BookingStatus.Completed),
            RevenueThisMonth: monthBookings
                .Where(b => b.Status == BookingStatus.Completed || b.Status == BookingStatus.Confirmed)
                .Sum(b => b.Price),
            TotalStudents: totalStudents,
            AverageRating: averageRating,
            UpcomingBookings: upcomingBookings.Select(MapToDto).ToList()
        );
    }

    private static BookingDto MapToDto(Booking b) => new(
        b.Id, b.StudentId, b.Student.FullName,
        b.LessonTypeId, b.LessonType.Name, b.LessonType.Language,
        b.Date, b.StartTime, b.EndTime,
        b.Status, b.StudentNotes, b.TeacherNotes,
        b.Price, b.MeetingLink, b.CreatedAt
    );
}
