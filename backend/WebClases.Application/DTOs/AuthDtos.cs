using WebClases.Domain.Enums;

namespace WebClases.Application.DTOs;

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string? Phone
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string Token,
    string Email,
    string FullName,
    UserRole Role,
    DateTime ExpiresAt
);

public record UserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    UserRole Role,
    DateTime CreatedAt
);
