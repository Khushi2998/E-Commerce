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

    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
    {
        return await _context.Products
            .Include(p => p.CategoryId)
            .OrderBy(p => p.Id)
            .Select(p => new ProductResponseDto
            {
                Id=p.Id,
                Name = p.Name,
                Price = p.Price,
                Description=p.Description,
                Image = p.Image
                
            })
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.CategoryId)
            .Where(p => p.Id == id)
            .Select(p => new ProductResponseDto
            {
                Id=p.Id,   
                Name = p.Name,
                Price = p.Price,
                Image = p.Image,
                Description=p.Description
            })
            .FirstOrDefaultAsync();
    }

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

            var physicalPath = Path.Combine(
                _env.WebRootPath,
                "images",
                fileName
            );

            using var stream = new FileStream(physicalPath, FileMode.Create);
            await dto.Image.CopyToAsync(stream);

            imageUrl = "/images/" + fileName;
        }


        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            Image = imageUrl,
            CategoryId = category.Id
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id=product.Id,
            Name = product.Name,
            Price = product.Price,
            Description = product.Description,
            Image = product.Image,
            CategoryName = category.Name
        };
    }


    public async Task<bool> UpdateAsync(int id, ProductUpdateDto dto)
    {
        var product = await _context.Products
            .Include(p => p.CategoryId)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return false;

        // Find category by name
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == dto.CategoryName);

        // Create category if it does not exist
        if (category == null)
        {
            category = new Category
            {
                Name = dto.CategoryName
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        if (dto.Image != null)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);

            var physicalPath = Path.Combine(
                _env.WebRootPath,
                "images",
                fileName
            );

            using var stream = new FileStream(physicalPath, FileMode.Create);
            await dto.Image.CopyToAsync(stream);

            product.Image = "/images/" + fileName;
        }


        // Update product fields
        product.Name = dto.Name;
        product.Price = dto.Price;
        //product.Image = imageUrl;
        product.Description = dto.Description;

        // IMPORTANT: assign CategoryId, not string
        product.CategoryId = category.Id;

        await _context.SaveChangesAsync();
        return true;
    }


    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}
