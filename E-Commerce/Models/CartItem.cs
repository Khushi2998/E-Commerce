using System.ComponentModel.DataAnnotations;

namespace ECommerce.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
