using ECommerce.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody]RegisterDto dto)
    {
        try
        {
            await _authService.RegisterAsync(dto);
            return Ok("Registration successful");
        }
        catch (InvalidOperationException ex) when (ex.Message == "EMAIL_EXISTS")
        {
            return Conflict(new { message = "Email already registered" });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Something went wrong. Please try again." });
        }
    }
    [HttpPost("login")]
    [Consumes("application/json")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (dto == null)
            return BadRequest("DTO IS NULL");

        var result = await _authService.LoginAsync(dto);

        if (result == null)
            return Unauthorized("Invalid email or password");

        return Ok(result);
    }
}
