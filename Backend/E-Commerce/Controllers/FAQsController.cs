using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Data;
using ECommerce.Models;
using Microsoft.EntityFrameworkCore;


namespace ECommerce.Controllers
{
    [Route("api/faqs")]
    [ApiController]
    public class FAQsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FAQsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetFAQs()
        {
            var faqs = await _context.FAQs
                .Where(f => f.IsActive)
                .ToListAsync();

            return Ok(faqs);
        }

        //  ADMIN (all FAQs)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllFAQs()
        {
            return Ok(await _context.FAQs.ToListAsync());
        }

        //  ADD FAQ
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddFAQ([FromBody] FAQ faq)
        {
            _context.FAQs.Add(faq);
            await _context.SaveChangesAsync();
            return Ok(faq);
        }

        //  UPDATE FAQ
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFAQ(int id, [FromBody] FAQ faq)
        {
            var existing = await _context.FAQs.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Question = faq.Question;
            existing.Answer = faq.Answer;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        //  TOGGLE STATUS
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return NotFound();

            faq.IsActive = !faq.IsActive;
            await _context.SaveChangesAsync();

            return Ok(faq);
        }

        //  DELETE FAQ
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return NotFound();

            _context.FAQs.Remove(faq);
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
