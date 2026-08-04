using Microsoft.EntityFrameworkCore;
using WebClases.Application.DTOs;
using WebClases.Application.Interfaces;
using WebClases.Domain.Entities;
using WebClases.Domain.Enums;
using WebClases.Infrastructure.Data;

namespace WebClases.Infrastructure.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly AppDbContext _context;

    public AvailabilityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AvailabilityDto>> GetAllAvailabilitiesAsync()
    {
        return await _context.Availabilities
            .OrderBy(a => a.DayOfWeek)
            .ThenBy(a => a.StartTime)
            .Select(a => new AvailabilityDto(
                a.Id, a.DayOfWeek, a.StartTime, a.EndTime,
                a.IsRecurring, a.SpecificDate, a.IsBlocked
            ))
            .ToListAsync();
    }

    public async Task<List<TimeSlotDto>> GetAvailableSlotsAsync(
        DateOnly startDate, DateOnly endDate, int durationMinutes = 60)
    {
        var teacherProfile = await _context.TeacherProfiles.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("No teacher profile found.");

        var availabilities = await _context.Availabilities
            .Where(a => a.TeacherProfileId == teacherProfile.Id && !a.IsBlocked)
            .ToListAsync();

        var existingBookings = await _context.Bookings
            .Where(b => b.Date >= startDate && b.Date <= endDate
                && b.Status != BookingStatus.Cancelled)
            .ToListAsync();

        var blockedSlots = await _context.Availabilities
            .Where(a => a.TeacherProfileId == teacherProfile.Id
                && a.IsBlocked && a.SpecificDate.HasValue
                && a.SpecificDate >= startDate && a.SpecificDate <= endDate)
            .ToListAsync();

        var slots = new List<TimeSlotDto>();
        var duration = TimeSpan.FromMinutes(durationMinutes);

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var dayOfWeek = date.ToDateTime(TimeOnly.MinValue).DayOfWeek;

            // Get recurring availabilities for this day
            var dayAvailabilities = availabilities
                .Where(a => a.IsRecurring && a.DayOfWeek == dayOfWeek)
                .ToList();

            // Add specific date availabilities
            dayAvailabilities.AddRange(availabilities
                .Where(a => !a.IsRecurring && a.SpecificDate == date));

            foreach (var availability in dayAvailabilities)
            {
                var slotStart = availability.StartTime;
                while (slotStart + duration <= availability.EndTime)
                {
                    var slotEnd = slotStart + duration;

                    // Check if blocked
                    var isBlocked = blockedSlots.Any(b =>
                        b.SpecificDate == date &&
                        b.StartTime < slotEnd && b.EndTime > slotStart);

                    // Check if already booked
                    var isBooked = existingBookings.Any(b =>
                        b.Date == date &&
                        b.StartTime < slotEnd && b.EndTime > slotStart);

                    // Don't show past slots
                    var isPast = date == DateOnly.FromDateTime(DateTime.Now)
                        && slotStart <= DateTime.Now.TimeOfDay;

                    var isAvailable = !isBlocked && !isBooked && !isPast;

                    slots.Add(new TimeSlotDto(date, slotStart, slotEnd, isAvailable));

                    slotStart = slotEnd;
                }
            }
        }

        return slots.OrderBy(s => s.Date).ThenBy(s => s.StartTime).ToList();
    }

    public async Task<AvailabilityDto> CreateAvailabilityAsync(CreateAvailabilityRequest request)
    {
        var teacherProfile = await _context.TeacherProfiles.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("No teacher profile found.");

        var availability = new Availability
        {
            TeacherProfileId = teacherProfile.Id,
            DayOfWeek = request.DayOfWeek,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            IsRecurring = request.IsRecurring,
            SpecificDate = request.SpecificDate,
            IsBlocked = request.IsBlocked
        };

        _context.Availabilities.Add(availability);
        await _context.SaveChangesAsync();

        return new AvailabilityDto(
            availability.Id, availability.DayOfWeek, availability.StartTime,
            availability.EndTime, availability.IsRecurring,
            availability.SpecificDate, availability.IsBlocked
        );
    }

    public async Task<AvailabilityDto> UpdateAvailabilityAsync(Guid id, CreateAvailabilityRequest request)
    {
        var availability = await _context.Availabilities.FindAsync(id)
            ?? throw new KeyNotFoundException("Disponibilidad no encontrada.");

        availability.DayOfWeek = request.DayOfWeek;
        availability.StartTime = request.StartTime;
        availability.EndTime = request.EndTime;
        availability.IsRecurring = request.IsRecurring;
        availability.SpecificDate = request.SpecificDate;
        availability.IsBlocked = request.IsBlocked;

        await _context.SaveChangesAsync();

        return new AvailabilityDto(
            availability.Id, availability.DayOfWeek, availability.StartTime,
            availability.EndTime, availability.IsRecurring,
            availability.SpecificDate, availability.IsBlocked
        );
    }

    public async Task DeleteAvailabilityAsync(Guid id)
    {
        var availability = await _context.Availabilities.FindAsync(id)
            ?? throw new KeyNotFoundException("Disponibilidad no encontrada.");

        _context.Availabilities.Remove(availability);
        await _context.SaveChangesAsync();
    }

    public async Task BlockSlotAsync(DateOnly date, TimeSpan startTime, TimeSpan endTime)
    {
        var teacherProfile = await _context.TeacherProfiles.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("No teacher profile found.");

        var blockedSlot = new Availability
        {
            TeacherProfileId = teacherProfile.Id,
            DayOfWeek = date.ToDateTime(TimeOnly.MinValue).DayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
            IsRecurring = false,
            SpecificDate = date,
            IsBlocked = true
        };

        _context.Availabilities.Add(blockedSlot);
        await _context.SaveChangesAsync();
    }
}
