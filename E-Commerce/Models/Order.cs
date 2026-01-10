using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ECommerce.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // FK
        public int CustomerId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Shipped, Delivered
        
    
}
}
