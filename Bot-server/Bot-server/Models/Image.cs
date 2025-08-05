namespace Bot_server.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Drawing> Commands { get; set; }

        public Image()
        {
            Commands = new List<Drawing>();
        }
    }
}
