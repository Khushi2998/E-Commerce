using System.ComponentModel.DataAnnotations;

namespace ECommerce.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        [Required]
        public int Rating { get; set; } // 1–5

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public int CustomerId { get; set; }
    }
}
