/*using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.DTOs;

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

        // Customer submits feedback
        
    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackCreateDto dto)
    {
        // Validate input
        if (dto == null)
            return BadRequest("Feedback data is required");

        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Message cannot be empty");

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        // Get logged-in customer ID
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int customerId))
            return Unauthorized();

        // Create Feedback entity manually
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



        // Admin views all feedback
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.Customer)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new FeedbackResponseDto
                {
                    Id = f.Id,
                    Message = f.Message,
                    Rating = f.Rating,
                    CreatedAt = f.CreatedAt,
                    Customer = new CustomerMiniDto
                    {
                        Id = f.Customer.Id,
                        Name = f.Customer.Name,
                        Email = f.Customer.Email
                    }
                })
                .ToListAsync();

            return Ok(feedbacks);
        }

    }
}
*/