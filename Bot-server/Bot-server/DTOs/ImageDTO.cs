namespace Bot_server.DTOs
{
    public class ImageDTO
    {
        public string Name { get; set; } = null!;
        public int UserId { get; set; }
        public List<DrawingDTO> Commands { get; set; } = new List<DrawingDTO>();
    }

    public class Images
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
