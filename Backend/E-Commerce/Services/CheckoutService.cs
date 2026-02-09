using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Services
{
    public class CheckoutService
    {
        private readonly AppDbContext _context;

        public CheckoutService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CheckoutResponseDto> CheckoutAsync(int customerId)
        {
            // 1️ Get cart items with product price (JOIN)
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
                throw new Exception("Cart is empty");

            // 2️ Calculate total
            var totalAmount = cartItems.Sum(i => i.Price * i.Quantity);

            // 3️ Create order (NO OrderItems here)
            var order = new Order
            {
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = totalAmount
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // generate OrderId

            // 4️ Create order items manually
            var orderItems = cartItems.Select(c => new OrderItem
            {
                OrderId = order.Id,
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                Price = c.Price
            }).ToList();

            _context.OrderItems.AddRange(orderItems);

            // 5️ Clear cart
            var cartEntities = _context.CartItems
                .Where(c => c.CustomerId == customerId);

            _context.CartItems.RemoveRange(cartEntities);

            await _context.SaveChangesAsync();

            // 6️ Response
            return new CheckoutResponseDto
            {
                OrderId = order.Id,
                TotalAmount = totalAmount
            };
        }
    }
}
