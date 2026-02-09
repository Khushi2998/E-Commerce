using ECommerce.DTOs;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);

}
