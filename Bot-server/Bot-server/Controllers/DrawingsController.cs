using Bot_server.DTOs;
using Bot_server.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Bot_server.Models;
using Microsoft.Extensions.Logging;
//using static System.Net.Mime.MediaTypeNames;

namespace Bot_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrawingController : ControllerBase
    {
        private readonly IDrawingService _drawingService;
        private readonly IMapper _mapper;
        private readonly ILogger<DrawingController> _logger;

        public DrawingController(IDrawingService drawingService, IMapper mapper, ILogger<DrawingController> logger)
        {
            _drawingService = drawingService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage([FromRoute] int id)
        {
            _logger.LogInformation("Request received for image with id {ImageId}", id);
            try
            {
                var image = await _drawingService.GetImageByIdAsync(id);
                if (image == null)
                {
                    _logger.LogWarning("Image with id {ImageId} not found", id);
                    return NotFound($"Image with id {id} not found.");
                }

                _logger.LogInformation("Returning image with id {ImageId}", id);
                return Ok(image);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting image with id {ImageId}", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetImagesByUser([FromRoute] int userId)
        {
            _logger.LogInformation("Request received for images by user {UserId}", userId);
            try
            {
                var images = await _drawingService.GetImagesByUserIdAsync(userId);
                _logger.LogInformation("Returning {Count} images for user {UserId}", images?.Count() ?? 0, userId);
                var Imagess = _mapper.Map<List<Images>>(images);

                return Ok(Imagess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting images for user {UserId}", userId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("image")]
        public async Task<IActionResult> AddImage([FromBody] ImageDTO imageDto)
        {
            _logger.LogInformation("Request received to add new image");
            try
            {
                if (imageDto == null)
                {
                    _logger.LogWarning("Received null ImageDTO");
                    return BadRequest("Image is null.");
                }

                var image = _mapper.Map<Image>(imageDto);
                await _drawingService.AddImageAsync(image);

                var createdImageDto = _mapper.Map<ImageDTO>(image);
                _logger.LogInformation("Image created with id {ImageId}", image.Id);

                return CreatedAtAction(nameof(GetImage), new { id = image.Id }, createdImageDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a new image");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
