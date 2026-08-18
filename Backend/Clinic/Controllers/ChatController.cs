using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Clinic.Controllers;

public class ChatController(IChatService chatService) : ApiController
{
    [AllowAnonymous]
    [EnableRateLimiting("chat")]
    [HttpPost("triage")]
    public async Task<IActionResult> Triage([FromBody] ChatTriageRequest request, CancellationToken cancellationToken)
    {
        var result = await chatService.TriageAsync(request, cancellationToken);
        if (!result.Succeeded)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = result.Error });
        }

        return Ok(result.Data);
    }
}
