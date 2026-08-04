using WebClases.Application.DTOs;

namespace WebClases.Application.Interfaces;

public interface IAvailabilityService
{
    Task<List<AvailabilityDto>> GetAllAvailabilitiesAsync();
    Task<List<TimeSlotDto>> GetAvailableSlotsAsync(DateOnly startDate, DateOnly endDate, int durationMinutes = 60);
    Task<AvailabilityDto> CreateAvailabilityAsync(CreateAvailabilityRequest request);
    Task<AvailabilityDto> UpdateAvailabilityAsync(Guid id, CreateAvailabilityRequest request);
    Task DeleteAvailabilityAsync(Guid id);
    Task BlockSlotAsync(DateOnly date, TimeSpan startTime, TimeSpan endTime);
}
