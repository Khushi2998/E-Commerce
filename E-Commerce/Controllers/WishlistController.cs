using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.Controllers
{
    
        [Authorize]
        [ApiController]
        [Route("api/wishlist")]
        public class WishlistController : ControllerBase
        {
            private readonly AppDbContext _context;

            public WishlistController(AppDbContext context)
            {
                _context = context;
            }
            private int UserId
            {
               get
               {
                  var claim = User.FindFirst("userId")
                            ?? User.FindFirst(ClaimTypes.NameIdentifier);

                   if (claim == null)
                    throw new UnauthorizedAccessException("UserId claim not found");

                   return int.Parse(claim.Value);
            }
        }


        [HttpPost]
            public async Task<IActionResult> Save(List<int> productIds)
            {
                var existing = await _context.Wishlists
                    .Where(w => w.UserId == UserId)
                    .Select(w => w.ProductId)
                    .ToListAsync();

                var newItems = productIds
                    .Where(id => !existing.Contains(id))
                    .Select(id => new Wishlist
                    {
                        UserId = UserId,
                        ProductId = id
                    });

                _context.Wishlists.AddRange(newItems);
                await _context.SaveChangesAsync();

                return Ok();
            }

            [HttpGet]
            public async Task<IActionResult> Get()
            {
                var productIds = await _context.Wishlists
                    .Where(w => w.UserId == UserId)
                    .Select(w => w.ProductId)
                    .ToListAsync();

                return Ok(productIds);
            }

            [HttpDelete("{productId}")]
            public async Task<IActionResult> Remove(int productId)
            {
                var item = await _context.Wishlists.FirstOrDefaultAsync(
                    w => w.UserId == UserId && w.ProductId == productId);

                if (item == null) return NotFound();

                _context.Wishlists.Remove(item);
                await _context.SaveChangesAsync();
                return Ok();
            }
        }

    }

