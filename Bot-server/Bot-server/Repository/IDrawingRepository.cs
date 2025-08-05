using Bot_server.Models;

public interface IDrawingRepository
{
    Task<Image?> GetImageByIdAsync(int imageId);
    Task<List<Image>> GetImagesByUserIdAsync(int userId);
    Task AddImageAsync(Image image); // שומרת גם את הפקודות (Drawing)
}
