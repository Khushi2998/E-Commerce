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
    [Route("api/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

    
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Invalid feedback data");

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest("Rating must be between 1 and 5");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int customerId))
                return Unauthorized();

            var feedback = new Feedback
            {
                Message = dto.Message,
                Rating = dto.Rating,
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbacks = await (
                from f in _context.Feedbacks
                join c in _context.Customers
                    on f.CustomerId equals c.Id
                orderby f.CreatedAt descending
                select new FeedbackResponseDto
                {
                    Id = f.Id,
                    Message = f.Message,
                    Rating = f.Rating,
                    CreatedAt = f.CreatedAt,
                    Customer = new CustomerMiniDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Email = c.Email
                    }
                }
            ).ToListAsync();

            return Ok(feedbacks);
        }
    }
}
