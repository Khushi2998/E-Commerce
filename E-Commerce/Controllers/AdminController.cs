using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // ==============================
        // Products
        // ==============================
        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Select(p => new
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    ProductPrice = p.Price,
                    ProductDescription = p.Description,
                    ProductImage = p.Image
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<IActionResult> AddProduct([FromForm] ProductCreateDto dto)
        {
            string? imageUrl = null;

            if (dto.Image != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var path = Path.Combine("wwwroot/images", fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imageUrl = "/images/" + fileName;
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                Image = imageUrl
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Product created", ProductId = product.Id });
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (dto.Image != null)
            {
                if (!string.IsNullOrEmpty(product.Image))
                {
                    var oldPath = Path.Combine("wwwroot", product.Image.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var path = Path.Combine("wwwroot/images", fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                product.Image = "/images/" + fileName;
            }

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Product updated", ProductId = product.Id });
        }

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Product deleted" });
        }

        // ==============================
        // Categories
        // ==============================
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Category created", CategoryId = category.Id });
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = category.Name;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Category updated", CategoryId = existing.Id });
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound();

            _context.Categories.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Category deleted" });
        }

        // ==============================
        // Feedback
        // ==============================
        [HttpGet("feedback")]
        public async Task<IActionResult> GetFeedback()
        {
            var feedbacks = await _context.Feedbacks
                .Select(f => new
                {
                    f.Id,
                    f.CustomerId,
                    f.Message,
                    f.CreatedAt
                })
                .ToListAsync();

            return Ok(feedbacks);
        }

        // ==============================
        // FAQs
        // ==============================
        [HttpGet("faqs")]
        public async Task<IActionResult> GetFAQs()
        {
            var faqs = await _context.FAQs
                .Select(f => new
                {
                    f.Id,
                    f.Question,
                    f.Answer
                })
                .ToListAsync();

            return Ok(faqs);
        }

        // ==============================
        // Orders
        // ==============================
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            // Join Orders with Customers and OrderItems
            var orders = await (from o in _context.Orders
                                join c in _context.Customers on o.CustomerId equals c.Id
                                select new
                                {
                                    OrderId = o.Id,
                                    CustomerName = c.Name,
                                    CustomerEmail = c.Email,
                                    TotalAmount = o.TotalAmount,
                                    CreatedAt = o.CreatedAt,
                                    Items = _context.OrderItems
                                        .Where(oi => oi.OrderId == o.Id)
                                        .Select(oi => new
                                        {
                                            ProductId = oi.ProductId,
                                            Quantity = oi.Quantity,
                                            Price = oi.Price
                                        })
                                        .ToList()
                                })
                                .ToListAsync();

            return Ok(orders);
        }
    }
}
