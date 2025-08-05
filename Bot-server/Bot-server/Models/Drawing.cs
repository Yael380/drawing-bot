using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Bot_server.Models
{
    public class Drawing
    {
        public int Id { get; set; }
        public int ImageId { get; set; }
        [JsonIgnore]
        public Image Image { get; set; } = null!;

        public string Type { get; set; } = null!; // "circle", "rectangle", "line", "triangle"
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
