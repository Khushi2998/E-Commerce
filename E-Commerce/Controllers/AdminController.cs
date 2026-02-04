using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
                    ProductImage = p.Image,
                    ProductCategory=p.CategoryId,
                    ProductStock=p.Stock,
                    ProductIsActive=p.IsActive
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("products")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CategoryName))
                return BadRequest("CategoryName is required");

            var category = await _context.Categories
                .FirstOrDefaultAsync(c =>
                    c.Name.ToLower() == dto.CategoryName.Trim().ToLower());

            if (category == null)
            { 
                category = new Category
                {
                    Name = dto.CategoryName.Trim()
                };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        string? imageUrl = null;

            if (dto.Image != null)
            {
                var uploadDir = Path.Combine("wwwroot", "images");
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var path = Path.Combine(uploadDir, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imageUrl = "/images/" + fileName;
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                CategoryId = category.Id,
                Image = imageUrl,
                Stock=dto.Stock,
                Description = dto.Description ?? ""
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Product created", ProductId = product.Id });
        }

        [HttpPut("products/{id}")]
        [Authorize(Roles = "Admin")]
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

            // Partial updates (SAFE)
            if (dto.Name != null)
                product.Name = dto.Name;

            if (dto.Price.HasValue)
                product.Price = dto.Price.Value;

            if (dto.Description != null)
                product.Description = dto.Description;

            if (dto.IsActive.HasValue)
                product.IsActive = dto.IsActive.Value;

            if (dto.Stock.HasValue)
                product.Stock = dto.Stock.Value;

            await _context.SaveChangesAsync();
            return Ok(product);
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

        [HttpGet("categories")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    IsActive=c.IsActive
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> Create(CategoryCreateDto dto)
        {
            Category category = null;

            // CASE 1: Existing category selected
            if (dto.CategoryId.HasValue && dto.CategoryId > 0)
            {
                category = await _context.Categories
                    .FindAsync(dto.CategoryId.Value);

                if (category == null)
                    return BadRequest("Invalid category");
            }

            // CASE 2: Other → create new
            else if (!string.IsNullOrWhiteSpace(dto.NewCategoryName))
            {
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c =>
                        c.Name.ToLower() == dto.NewCategoryName.ToLower());

                if (existingCategory != null)
                {
                    category = existingCategory;
                }
                else
                {
                    category = new Category
                    {
                        Name = dto.NewCategoryName.Trim()
                    };

                    _context.Categories.Add(category);
                    await _context.SaveChangesAsync();
                }
            }
            return BadRequest("Category is required");
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryUpdateDto dto)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = dto.Name;
            existing.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Category updated", CategoryId = existing.Id });
        }
        
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
                                    Items = (from oi in _context.OrderItems
                                             join p in _context.Products on oi.ProductId equals p.Id
                                             where oi.OrderId == o.Id
                                             select new
                                             {
                                                 ItemId=oi.Id,
                                                 ProductId = oi.ProductId,
                                                 ProductName = p.Name,
                                                 ProductImage = p.Image, 
                                                 Quantity = oi.Quantity,
                                                 Price = oi.Price,
                                                 Status = oi.Status
                                             }).ToList()
                                }).ToListAsync();

            return Ok(orders);
        }

        public class UpdateOrderStatusDto
        {
            public int Status { get; set; }
        }

        [HttpPut("orders/items/{orderItemId}/status")]
        public async Task<IActionResult> UpdateItemStatus(int orderItemId,[FromBody] UpdateOrderStatusDto dto)
        {
            var item = await _context.OrderItems
                .Include(oi => oi.Order)
                .FirstOrDefaultAsync(oi => oi.Id == orderItemId);

            if (item == null)
                return NotFound("Order item not found");

            //  Convert int → enum safely
            if (!Enum.IsDefined(typeof(OrderItemStatus), dto.Status))
                return BadRequest("Invalid status");

            item.Status = (OrderItemStatus)dto.Status;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                orderItemId,
                status = item.Status.ToString()
            });
        }

    }
}
