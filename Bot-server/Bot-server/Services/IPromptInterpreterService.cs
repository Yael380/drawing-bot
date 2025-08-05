using Bot_server.DTOs;
using Bot_server.Models;

namespace Bot_server.Services
{
    public interface IPromptInterpreterService
    {
        //Task<string?> GetRawDrawingJsonAsync(string prompt);
        Task<string?> GetRawDrawingJsonAsync(string prompt, object existingCommands);
    }
}
