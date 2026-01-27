using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using ECommerce.Services;
using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // ========================= GET ALL =========================
    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
    {
        return await (
            from p in _context.Products
            join c in _context.Categories
                on p.CategoryId equals c.Id
            select new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Image = p.Image,
                IsActive = p.IsActive,
                Stock = p.Stock,
                CategoryName = c.Name
            }
        ).ToListAsync();
    }


    // ========================= GET BY ID =========================
    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        return await (
            from p in _context.Products
            join c in _context.Categories
                on p.CategoryId equals c.Id
            where p.Id == id
            select new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Image = p.Image,
                IsActive = p.IsActive,
                Stock = p.Stock,
                CategoryName = c.Name
            }
        ).FirstOrDefaultAsync();
    }


    // ========================= CREATE =========================
    public async Task<ProductResponseDto> CreateAsync(ProductCreateDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == dto.CategoryName);

        if (category == null)
        {
            category = new Category { Name = dto.CategoryName };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        string? imageUrl = null;

        if (dto.Image != null)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
            var path = Path.Combine(_env.WebRootPath, "images", fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await dto.Image.CopyToAsync(stream);

            imageUrl = "/images/" + fileName;
        }

        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            Image = imageUrl,
            CategoryId = category.Id,
            IsActive = true,
            Stock = dto.Stock
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            Description = product.Description,
            Image = product.Image,
            CategoryName = category.Name,
            IsActive = product.IsActive,
            Stock = product.Stock
        };
    }

    // ========================= UPDATE DETAILS =========================
    public async Task<bool> UpdateAsync(int id, ProductUpdateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        if (!string.IsNullOrWhiteSpace(dto.Name))
            product.Name = dto.Name;

        if (dto.Price.HasValue)
            product.Price = dto.Price.Value;

        if (!string.IsNullOrWhiteSpace(dto.Description))
            product.Description = dto.Description;

        if (dto.Image != null)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
            var path = Path.Combine(_env.WebRootPath, "images", fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await dto.Image.CopyToAsync(stream);

            product.Image = "/images/" + fileName;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    // ========================= DELETE =========================
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}
