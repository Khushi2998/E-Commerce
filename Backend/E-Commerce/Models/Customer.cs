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
        public string? City { get; set; }
        public string? State { get; set; }
   
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be 6 digits")]
        public string? Pincode{get;set;}

        public int RoleId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

    }
}
