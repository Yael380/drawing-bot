namespace Bot_server.DTOs
{
    public class DrawingDTO
    {
        public string Type { get; set; } = null!;
        public float X { get; set; }
        public float Y { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
        public string Color { get; set; } = null!;
        public float Radius { get; set; }  // השדה החדש
        public float y2 { get; set; }  // השדה החדש
        public float x2 { get; set; }  // השדה החדש

    }
}
