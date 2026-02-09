using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/address")]
[Authorize]
public class AddressController : ControllerBase
{
    private readonly AppDbContext _context;

    public AddressController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Add(Address address)
    {
        var claim = User.FindFirst("userId")
            ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid UserId claim");

        address.UserId = userId;

        if (address.IsDefault)
        {
            var existing = _context.Addresses
                .Where(a => a.UserId == userId);

            foreach (var addr in existing)
                addr.IsDefault = false;
        }

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return Ok(address);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var claim = User.FindFirst("userId")
            ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid UserId claim");

        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.Id)
            .Take(3)
            .ToListAsync();

        return Ok(addresses);
    }

    [HttpPut("{id}/default")]
    public async Task<IActionResult> SetDefault(int id)
    {
        var claim = User.FindFirst("userId")
            ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid UserId claim");
        var addresses = _context.Addresses
            .Where(a => a.UserId == userId);

        foreach (var addr in addresses)
            addr.IsDefault = addr.Id == id;

        await _context.SaveChangesAsync();
        return Ok();
    }
}
