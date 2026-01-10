using System.ComponentModel.DataAnnotations;

namespace ECommerce.DTOs
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string CategoryName { get; set; }
        public IFormFile? Image { get; set; }
    }
}
