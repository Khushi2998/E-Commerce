namespace ECommerce.DTOs
{
    public class ProductUpdateDto 
    {
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public string? Description { get; set; }

        public bool? IsActive { get; set; }
        public int? Stock { get; set; }

        public IFormFile? Image { get; set; }

    }
    
}
