using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // Public - Get all categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }

        // Public - Get single category
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();

            if (category == null) return NotFound();
            return Ok(category);
        }

        // Admin - Create category
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CategoryCreateDto dto)
        {
            Category category = null;

            // CASE 1: Existing category selected
            if (dto.CategoryId.HasValue)
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

        

        // Admin - Update category
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CategoryCreateDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.NewCategoryName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Admin - Delete category
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
