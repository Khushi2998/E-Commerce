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
                customer.Email,
                customer.Contact,
                customer.Address,
                customer.City,
                customer.State,
                customer.Pincode
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
            customer.City=dto.City;
            customer.State=dto.State;
            customer.Pincode=dto.Pincode;
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [Authorize]
        [HttpGet("my/orders")]
        public async Task<IActionResult> MyOrders(
           [FromQuery] int page=1,
           [FromQuery] int pageSize=5)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 20) pageSize = 5;
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var query = _context.Orders
                .Where(o => o.CustomerId == userId);
            Console.WriteLine($"PAGE RECEIVED => {page}, SIZE => {pageSize}");
            Console.WriteLine(" MY ORDERS ENDPOINT HIT ");
            Console.WriteLine($"QUERY STRING => {Request.QueryString}");

            var totalOrders = await query.CountAsync();
            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .ThenByDescending(o => o.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new
                {
                    id = o.Id,
                    totalAmount = o.TotalAmount,
                    createdAt = o.CreatedAt,
                    paymentMethod=o.PaymentMethod,
                    items = (
                        from oi in _context.OrderItems
                        join p in _context.Products
                            on oi.ProductId equals p.Id
                        where oi.OrderId == o.Id
                        select new
                        {
                            name = p.Name,
                            quantity = oi.Quantity,
                            price = oi.Price,
                            image = p.Image
                        }
                    ).ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                page,
                pageSize,
                totalOrders,
                orders
            });
        }



      
        [Authorize]
        [HttpGet("orders/{orderId}")]
        public async Task<IActionResult> MyOrderById(int orderId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var order = await _context.Orders
                .Where(o => o.Id == orderId && o.CustomerId == userId)
                .Select(o => new
                {
                    id = o.Id,
                    totalAmount = o.TotalAmount,
                    createdAt = o.CreatedAt,
                    paymentMethod = o.PaymentMethod,
                    shippingAddress = o.ShippingAddress,

                    items = (
                        from oi in _context.OrderItems
                        join p in _context.Products
                            on oi.ProductId equals p.Id
                        where oi.OrderId == o.Id
                        select new
                        {
                            itemId = oi.Id,       
                            productId = p.Id,
                            name = p.Name,
                            quantity = oi.Quantity,
                            price = oi.Price,
                            status = oi.Status.ToString(),
                            image = p.Image
                        }
                    ).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
                return NotFound(new { message = "Order not found" });

            return Ok(order);
        }

        [HttpPost("orders/items/{orderItemId}/cancel")]
        public async Task<IActionResult> CancelItem(int orderItemId)
        {
            var item = await _context.OrderItems
                .Join(_context.Products,
                    oi => oi.ProductId,
                    p => p.Id,
                    (oi, p) => new { oi, p })
                .FirstOrDefaultAsync(x => x.oi.Id == orderItemId);

            if (item == null)
                return NotFound();

            //  Cannot cancel after delivery
            if (item.oi.Status == OrderItemStatus.Delivered)
                return BadRequest("Delivered items cannot be cancelled");

            item.oi.Status = OrderItemStatus.Cancelled;

            //  Restore stock
            item.p.Stock += item.oi.Quantity;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Item cancelled and stock restored" });
        }

    }
}

