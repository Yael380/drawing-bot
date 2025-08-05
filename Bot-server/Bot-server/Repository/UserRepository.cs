using Bot_server.Models;
using Bot_server.DB;
using Microsoft.EntityFrameworkCore;

namespace Bot_server.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DrawingDbContext _context;

        public UserRepository(DrawingDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
    }

}
