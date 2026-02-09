using ECommerce.Data;
using ECommerce.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Services
{
    public class CartService
    {
        private readonly AppDbContext _context;

        public CartService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartResponseDto>> GetCartAsync(int customerId)
        {
            var cartItems = await (
                from c in _context.CartItems
                join p in _context.Products
                    on c.ProductId equals p.Id
                where c.CustomerId == customerId
                select new CartResponseDto
                {
                    CartId = c.Id,
                    ProductId = p.Id,
                    ProductName = p.Name,
                    Image = p.Image,
                    Price = p.Price,
                    Quantity = c.Quantity
                }
            ).ToListAsync();

            return cartItems;
        }
    }
}
