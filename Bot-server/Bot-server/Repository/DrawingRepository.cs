using Bot_server.DB;
using Bot_server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bot_server.Repository
{
    public class DrawingRepository : IDrawingRepository
    {
        private readonly DrawingDbContext _context;

        public DrawingRepository(DrawingDbContext context)
        {
            _context = context;
        }

        public async Task<Image?> GetImageByIdAsync(int imageId)
        {
            return await _context.Images
                .Include(i => i.Commands)
                .FirstOrDefaultAsync(i => i.Id == imageId);
        }

        public async Task<List<Image>> GetImagesByUserIdAsync(int userId)
        {
            return await _context.Images
                .Where(i => i.UserId == userId)
                .Include(i => i.Commands)
                .ToListAsync();
        }

        public async Task AddImageAsync(Image image)
        {
            await _context.Images.AddAsync(image);
            await _context.SaveChangesAsync();
        }

    }



}
