using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]

        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }
       public string? Image { get; set; }

        // FK
        public int CategoryId { get; set; }
    }
}
