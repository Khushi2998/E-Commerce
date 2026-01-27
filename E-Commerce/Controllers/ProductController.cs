using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<Product>());

        var q = query.ToLower();
        var products = await _context.Products
            .Where(p => (p.Name != null && p.Name.ToLower().Contains(q)) ||
            (p.Description != null && p.Description.ToLower().Contains(q)))
        .ToListAsync();

        return Ok(products);
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.Products
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Description,
                p.Image
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _context.Products
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Description,
                p.Image
            })
            .FirstOrDefaultAsync();

        if (product == null) return NotFound();
        return Ok(product);
    }

 
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CategoryName))
            return BadRequest("Category is required");
        var category = await _context.Categories
            .FirstOrDefaultAsync(c =>
            c.Name.ToLower() == dto.CategoryName.Trim().ToLower()
        );

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
            CategoryId = category.Id,
            Image = imageUrl
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Product created", ProductId = product.Id });
    }


    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        // Image update
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

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
