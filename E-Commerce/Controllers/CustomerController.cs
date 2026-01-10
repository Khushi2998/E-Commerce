using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.Controllers
{
    [ApiController]
    [Route("api/customer")]
    [Authorize(Roles = "Customer")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        //  Get logged-in customer profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var customerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
            );

            var customer = await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return NotFound();

            return Ok(new
            {
                customer.Id,
                customer.Name,
                customer.Email
               
            });
        }

        //  Update profile (no password here)
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(Customer updated)
        {
            var customerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
            );

            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
                return NotFound();

            customer.Name = updated.Name;
            customer.Address = updated.Address;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

