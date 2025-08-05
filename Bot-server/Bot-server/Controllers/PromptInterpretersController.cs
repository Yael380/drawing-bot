using Bot_server.DTOs;
using Bot_server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Bot_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrawingPromptController : ControllerBase
    {
        private readonly IPromptInterpreterService _promptService;

        public DrawingPromptController(IPromptInterpreterService promptService)
        {
            _promptService = promptService;
        }

        [HttpPost("interpret-prompt")]
        public async Task<IActionResult> InterpretPrompt([FromBody] PromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest("Prompt is empty.");

            var rawJson = await _promptService.GetRawDrawingJsonAsync(request.Prompt, request.ExistingCommands);

            if (rawJson == null)
                return NotFound("No drawing commands returned.");

            return Content(rawJson, "application/json");
        }

    }



}
