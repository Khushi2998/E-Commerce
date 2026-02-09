using System.ComponentModel.DataAnnotations;

namespace ECommerce.Models
{
    public class Role
    {
        [Required]
        [Key]
        public int RoleId { get; set; }
        public string RoleName { get; set; }

    }
}
