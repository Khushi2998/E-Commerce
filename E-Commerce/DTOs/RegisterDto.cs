using System.ComponentModel.DataAnnotations;

namespace ECommerce.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Contact { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
