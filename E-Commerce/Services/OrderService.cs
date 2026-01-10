/*using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Services
{
    public class OrderService 
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> PlaceOrderAsync(OrderCreateDto dto)
        {
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal total = 0;

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    throw new Exception("Product not found");

                var orderItem = new OrderItem
                { 
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Price = product.Price
                };

                total += product.Price * item.Quantity;
                _context.OrderItems.Add(orderItem);
            }

            order.TotalAmount = total;
            await _context.SaveChangesAsync();

            return order.Id;
        }
    }
}
*/