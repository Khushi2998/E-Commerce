/*using ECommerce.Data;
using ECommerce.Models;
using ZstdSharp.Unsafe;

namespace ECommerce.Services
{
    public class InvoiceService
    {
        private readonly AppDbContext _context;
        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Invoice> CreateInvoice(int CustomerId,List<OrderItem> orderItem)
        {
            var subTotal = orderItem.Sum(i => i.Price * i.Quantity);
            var tax = subTotal * 0.18m;
            var total = subTotal + tax;

            var invoice = new Invoice
            {
                InvoiceNumber = $"INV-{DateTime.UtcNow.Ticks}",
                InvoiceDate = DateTime.UtcNow,
                CustomerId = CustomerId,
                SubTotal = subTotal,
                Tax = tax,
                Total = total,
                Items = orderItem.Select(c => new InvoiceItem
                {
                    ProductName = c.Product.Name,
                    Price = c.Price,
                    Quantity = c.Quantity
                }).ToList()
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return invoice;
        }
    }
}
*/