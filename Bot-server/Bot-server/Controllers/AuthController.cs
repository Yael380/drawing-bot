using Bot_server.DTOs;
using Bot_server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;  // הוסף את המרחב שמות הזה

namespace Bot_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger; // הוספת לוגר

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            _logger.LogInformation("התחלת רישום משתמש עם אימייל: {Email}", dto.Email);
            try
            {
                var result = await _userService.RegisterAsync(dto);
                if (!result.IsSuccess)
                {
                    _logger.LogWarning("רישום נכשל עבור אימייל: {Email}, סיבה: {Error}", dto.Email, result.ErrorMessage);
                    return BadRequest(result.ErrorMessage);
                }

                _logger.LogInformation("רישום הצליח עבור משתמש: {FullName}", dto.FullName);
                return Ok(result.User);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ברישום משתמש עם אימייל: {Email}", dto.Email);
                return StatusCode(500, $"שגיאת שרת: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            _logger.LogInformation("ניסיון התחברות משתמש עם אימייל: {Email}", dto.Email);
            try
            {
                var result = await _userService.LoginAsync(dto);
                if (!result.IsSuccess)
                {
                    _logger.LogWarning("התחברות נכשלה עבור אימייל: {Email}, סיבה: {Error}", dto.Email, result.ErrorMessage);
                    return Unauthorized(result.ErrorMessage);
                }

                _logger.LogInformation("התחברות הצליחה עבור משתמש");
                return Ok(result.User);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהתחברות משתמש עם אימייל: {Email}", dto.Email);
                return StatusCode(500, $"שגיאת שרת: {ex.Message}");
            }
        }
    }
}
