using WebClases.Application.DTOs;

namespace WebClases.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<UserDto> GetUserByIdAsync(Guid userId);
}
