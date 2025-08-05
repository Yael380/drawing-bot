using Bot_server.DTOs;

namespace Bot_server.Services
{
    public interface IUserService
    {
        Task<(bool IsSuccess, string? ErrorMessage, object? User)> RegisterAsync(RegisterDTO dto);
        Task<(bool IsSuccess, string? ErrorMessage, object? User)> LoginAsync(LoginDTO dto);
    }

}
