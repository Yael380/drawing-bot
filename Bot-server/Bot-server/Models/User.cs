namespace Bot_server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        public ICollection<Image> Images { get; set; }

        public User()
        {
            Images = new List<Image>();
        }
    }

}
