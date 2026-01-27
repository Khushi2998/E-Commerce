using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Tax { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

    }
}
