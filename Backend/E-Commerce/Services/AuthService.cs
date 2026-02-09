using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using ECommerce.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly EmailService _emailService;

    public AuthService(
        AppDbContext context,
        IConfiguration config,
        EmailService emailService)
    {
        _context = context;
        _config = config;
        _emailService = emailService;
    }


    public async Task RegisterAsync(RegisterDto dto)
    {
        if (await _context.Customers.AnyAsync(x => x.Email == dto.Email))
            throw new Exception("Email already exists");

        var generatedPassword = PasswordGenerator.Generate();
        var hashedPassword = Sha256Hasher.ComputeSHA256Hash(generatedPassword);

        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            Contact = dto.Contact,
            RoleId=2
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        if (await _context.Auth.AnyAsync(a => a.UserId == customer.Id))
            throw new Exception("Auth already exists for this user");

        var auth = new AuthTable
        {
            UserId = customer.Id,
            AutoGen = true,
            Password = hashedPassword
        };

        _context.Auth.Add(auth);   
        await _context.SaveChangesAsync();

        await _emailService.SendAsync(
            dto.Email,
            "Welcome to Infinity Store",
            $@"
        <h3>Hello {dto.Name}</h3>
        <p>Your account has been created.</p>
        <p><b>Email:</b> {dto.Email}</p>
        <p><b>Password:</b> {generatedPassword}</p>
        <p>Please enter this password to login.</p>"
        );
    }


    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await (
            from c in _context.Customers
            join a in _context.Auth
                on c.Id equals a.UserId
            join r in _context.Roles
                on c.RoleId equals r.RoleId
            where c.Email == dto.Email
            select new
            {
                c.Id,
                c.Name,
                c.Email,
                PasswordHash = a.Password,
                RoleName = r.RoleName
            }
        ).FirstOrDefaultAsync();

        if (user == null)
            return null;

        if (Sha256Hasher.ComputeSHA256Hash(dto.Password) != user.PasswordHash)
            return null;

        var token = GenerateJwtToken(
            user.Id,
            user.Email,
            user.RoleName
        );

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role=user.RoleName
        };
    }



    private string GenerateJwtToken(int id, string email, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_config["Jwt:DurationInMinutes"])
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
