using System.ComponentModel.DataAnnotations;

namespace ECommerce.Models
{
    public class AuthTable
    {
        [Required]
        [Key]
        public int UserId { get; set; }
        public string Password { get; set; }
        public bool AutoGen { get; set; }
    }
}
