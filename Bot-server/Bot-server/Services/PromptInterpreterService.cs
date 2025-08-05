using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Bot_server.DTOs;
using Bot_server.Services;
using Microsoft.Extensions.Logging; 


public class PromptInterpreterService : IPromptInterpreterService
{
    private readonly HttpClient _httpClient;
    private readonly string _openAiApiKey;
    private readonly ILogger<PromptInterpreterService> _logger;  // שדה לוגינג

    public PromptInterpreterService(HttpClient httpClient, IConfiguration configuration, ILogger<PromptInterpreterService> logger)
    {
        _httpClient = httpClient;
        _openAiApiKey = configuration["OpenAI:ApiKey"];
        _logger = logger;
    }

    public async Task<string?> GetRawDrawingJsonAsync(string prompt, object existingCommands)
    {
        _logger.LogInformation("Starting GetRawDrawingJsonAsync with prompt: {Prompt}", prompt);

        string rules = @"You are a drawing assistant for a canvas sized 800x600 pixels.

General instructions:
- Use only the following shapes:
  - ""circle""
  - ""rectangle""
  - ""triangle""
  - ""line""
- Do not create or return any other object types.
- All drawings must be properly proportioned, logically placed on the canvas, and aesthetically pleasing.
- Shapes must have sizes appropriate to the object being drawn (e.g., a door should be smaller than the house).
- Colors should be realistic and appropriate for the object (e.g., sky is blue, grass is green, sun is yellow).
- Do not redraw or overlap elements that already exist; you will receive existing drawing commands to consider.
- Only draw what is explicitly requested, without any extra additions.

Specific layout rules:
- The sky is a blue rectangle at the top of the canvas, with a **thin Width of 150 or less** .
- The sun is a yellow circle positioned at the top-left corner unless specified otherwise by the user.
- The grass is a green rectangle at the bottom of the canvas.
- The house should be centered on the canvas unless another location is specified.
- Additional elements (like trees, roads, cars, etc.) should be placed logically relative to existing objects (e.g., a tree next to the house, cars on the road).

Response format:
Return only new drawing commands in JSON with the following structure:
{ 
  ""commands"": [ ... ],  // array of new drawing commands only  
  ""text"": ""A very very brief explanation of what was drawn(Your reply must be in the same language as the user's prompt.)""
}
Your reply must be in the same language as the user's prompt.";

        try
        {
            var existingJson = JsonSerializer.Serialize(existingCommands, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            var userContent = @$"
These are the current drawing commands already on the canvas (do not repeat or overlap them):
{existingJson}

{prompt}
";

            var requestBody = new
            {
                model = "gpt-4o",
                messages = new[]
                {
                    new { role = "system", content = rules },
                    new { role = "user", content = userContent }
                },
                functions = new[]
                {
                    new
                    {
                        name = "generateDrawing",
                        description = "Returns drawing commands and explanatory text",
                        parameters = new
                        {
                            type = "object",
                            properties = new
                            {
                                name = new { type = "string" },
                                userId = new { type = "integer" },
                                commands = new
                                {
                                    type = "array",
                                    items = new
                                    {
                                        type = "object",
                                        properties = new
                                        {
                                            type = new { type = "string" },
                                            x = new { type = "integer" },
                                            y = new { type = "integer" },
                                            radius = new { type = "integer" },
                                            width = new { type = "integer" },
                                            height = new { type = "integer" },
                                            x2 = new { type = "integer" },
                                            y2 = new { type = "integer" },
                                            color = new { type = "string" },
                                            strokeWidth = new { type = "integer" }
                                        },
                                        required = new[] { "type", "x", "y", "color" }
                                    }
                                },
                                text = new { type = "string" }
                            },
                            required = new[] { "commands", "text" }
                        }
                    }
                },
                function_call = new { name = "generateDrawing" },
                temperature = 0.2
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _openAiApiKey);
            request.Content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            _logger.LogInformation("Sending request to OpenAI API");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("Received response from OpenAI API");

            using var doc = JsonDocument.Parse(responseJson);
            var argsJson = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("function_call")
                .GetProperty("arguments")
                .GetString();

            _logger.LogInformation("Parsed drawing JSON successfully");

            return argsJson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetRawDrawingJsonAsync");
            throw;
        }
    }
}




