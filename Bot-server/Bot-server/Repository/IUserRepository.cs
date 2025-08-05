using Bot_server.Models;

namespace Bot_server.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task AddUserAsync(User user);
    }

}
