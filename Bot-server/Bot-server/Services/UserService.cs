using Bot_server.DTOs;
using Bot_server.Models;
using Bot_server.Repository;
using Microsoft.Extensions.Logging;

namespace Bot_server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<(bool, string?, object?)> RegisterAsync(RegisterDTO dto)
        {
            if (await _userRepository.EmailExistsAsync(dto.Email))
            {
                _logger.LogWarning("Registration failed: Email {Email} already exists", dto.Email);
                return (false, "אימייל כבר קיים", null);
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = hashedPassword
            };

            await _userRepository.AddUserAsync(user);

            _logger.LogInformation("User registered successfully: {UserId}", user.Id);

            return (true, null, new { user.Id, user.FullName, user.Email });
        }

        public async Task<(bool, string?, object?)> LoginAsync(LoginDTO dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                _logger.LogWarning("Login failed for email {Email}", dto.Email);
                return (false, "אימייל או סיסמה לא נכונים", null);
            }

            _logger.LogInformation("User logged in successfully: {UserId}", user.Id);
            return (true, null, new { user.Id, user.FullName, user.Email });
        }
    }
}
