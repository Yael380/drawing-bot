using Bot_server.Models;
using Bot_server.DTOs;
using Bot_server.Repository;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace Bot_server.Services
{
    public class DrawingService : IDrawingService
    {
        private readonly IDrawingRepository _drawingRepository;
        private readonly ILogger<DrawingService> _logger;

        public DrawingService(IDrawingRepository drawingRepository, ILogger<DrawingService> logger)
        {
            _drawingRepository = drawingRepository;
            _logger = logger;
        }

        public async Task<Image?> GetImageByIdAsync(int imageId)
        {
            _logger.LogInformation("Fetching image by id {ImageId}", imageId);
            var image = await _drawingRepository.GetImageByIdAsync(imageId);
            if (image == null)
            {
                _logger.LogWarning("Image with id {ImageId} not found", imageId);
                return null;
            }
            _logger.LogInformation("Image with id {ImageId} found", imageId);
            return image;
        }

        public async Task<List<Image>> GetImagesByUserIdAsync(int userId)
        {
            _logger.LogInformation("Fetching images for user {UserId}", userId);
            var images = await _drawingRepository.GetImagesByUserIdAsync(userId);
            _logger.LogInformation("Found {Count} images for user {UserId}", images.Count, userId);
            return images;
        }

        public async Task AddImageAsync(Image image)
        {
            _logger.LogInformation("Adding new image for user {UserId}", image.UserId);
            await _drawingRepository.AddImageAsync(image);
            _logger.LogInformation("Image added with id {ImageId}", image.Id);
        }
    }
}
