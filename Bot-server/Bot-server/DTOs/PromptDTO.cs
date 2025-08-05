namespace Bot_server.DTOs
{
    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
        public object ExistingCommands { get; set; } = new();
    }
}
