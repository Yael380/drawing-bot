using Bot_server.DTOs;
using Bot_server.Models;

namespace Bot_server.Services
{ 
    public interface IDrawingService
    {
        Task<Image?> GetImageByIdAsync(int imageId);
        Task<List<Image>> GetImagesByUserIdAsync(int userId);
        Task AddImageAsync(Image image);
    }
}
