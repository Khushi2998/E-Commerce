using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize(Roles = "User")]
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
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var customerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
            );

            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
                return NotFound("User Not Found");

            customer.Name = dto.Name;
            customer.Contact = dto.Contact;
            customer.Address = dto.Address;

            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [Authorize]
        [HttpGet("my/orders")]
        public async Task<IActionResult> MyOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();


            var result = orders.Select(o => new
            {
                o.Id,
                o.TotalAmount,
                Status = o.Status.ToString(),
                o.CreatedAt
            });
                

            return Ok(result);
        }

        [Authorize]
        [HttpGet("orders/{orderId}")]
        public async Task<IActionResult> OrderDetails(int orderId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var order = await _context.Orders
                 .FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == userId);
            if (order == null) return NotFound();
            return Ok(new
            {
                order.Id,
                Status = order.Status.ToString(),
                order.ShippingAddress,
                order.TotalAmount,
                order.CreatedAt
            });
        }


    }
}

