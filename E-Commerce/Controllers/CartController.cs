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
    [Route("api/cart")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        //  GET cart (CartItems + Products JOIN)
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var items = await (
                from c in _context.CartItems
                join p in _context.Products
                    on c.ProductId equals p.Id
                where c.CustomerId == customerId
                select new CartResponseDto
                {
                    CartId = c.Id,
                    ProductId = p.Id,
                    ProductName = p.Name,
                    Price = p.Price,
                    Quantity = c.Quantity,
                    Image = p.Image
                }
            ).ToListAsync();

            return Ok(items);
        }

        [HttpGet("count")]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult>GetCartCount()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var count = await _context.CartItems
                .Where(c => c.CustomerId == userId)
                .SumAsync(c=>c.Quantity);
            return Ok(count);
        }

        //  ADD to cart
        [HttpPost]
        public async Task<IActionResult> CartAdd([FromBody] CartAddDto dto)
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var existing = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.CustomerId == customerId &&
                ci.ProductId == dto.ProductId
            );

            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CustomerId = customerId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };

                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        //  UPDATE quantity
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartQuantityDto dto)
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.CustomerId == customerId);

            if (item == null) return NotFound();

            item.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE item
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.CustomerId == customerId);

            if (item == null) return NotFound("Item Not Found");

            _context.CartItems.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Cart item already deleted");
            }

            return Ok(new { message = "Item removed successfully" });
        }
    }
}
