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
            return Ok(await _context.FAQs.ToListAsync());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddFAQ([FromBody] FAQ faq)
        {
            _context.FAQs.Add(faq);
            await _context.SaveChangesAsync();
            return Ok(faq);
        }
    }
}
