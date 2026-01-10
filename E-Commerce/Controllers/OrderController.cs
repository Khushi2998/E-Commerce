using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize(Roles = "Customer")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // Get logged-in customer's orders
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var orders = await (
                from o in _context.Orders
                join oi in _context.OrderItems
                    on o.Id equals oi.OrderId
                join p in _context.Products
                    on oi.ProductId equals p.Id
                where o.CustomerId == customerId
                select new
                {
                    OrderId = o.Id,
                    o.CreatedAt,
                    o.TotalAmount,
                    ProductName = p.Name,
                    oi.Quantity,
                    Price = oi.Price
                }
            ).ToListAsync();

            return Ok(orders);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var cartItems = await (
                from c in _context.CartItems
                join p in _context.Products
                    on c.ProductId equals p.Id
                where c.CustomerId == customerId
                select new
                {
                    c.ProductId,
                    c.Quantity,
                    Price = p.Price
                }
            ).ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty");

            var totalAmount = cartItems.Sum(c => c.Price * c.Quantity);

            var order = new Order
            {
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = totalAmount
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // generate OrderId

            var orderItems = cartItems.Select(c => new OrderItem
            {
                OrderId = order.Id,
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                Price = c.Price
            }).ToList();

            _context.OrderItems.AddRange(orderItems);

            var cartEntities = _context.CartItems.Where(c => c.CustomerId == customerId);
            _context.CartItems.RemoveRange(cartEntities);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                order.Id,
                order.TotalAmount,
                Items = orderItems
            });
        }


    }
}
