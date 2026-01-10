using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ECommerce.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Contact { get; set; }
        public string? Address { get; set; }

        public int RoleId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

    }
}
