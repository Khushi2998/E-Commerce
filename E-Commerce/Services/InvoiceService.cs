using ECommerce.Data;
using ECommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Services
{
    public class InvoiceService
    {
        private readonly AppDbContext _context;

        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice> CreateInvoice(int orderId, int customerId)
        {
            // 🔹 Fetch order items using joins
            var orderItems = await (
                from oi in _context.OrderItems
                join p in _context.Products on oi.ProductId equals p.Id
                where oi.OrderId == orderId
                select new
                {
                    p.Name,
                    oi.Price,
                    oi.Quantity
                }
            ).ToListAsync();

            if (!orderItems.Any())
                throw new Exception("No order items found");

            var subTotal = orderItems.Sum(i => i.Price * i.Quantity);
            var tax = subTotal * 0.08m;
            var total = subTotal + tax;

            var invoice = new Invoice
            {
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{orderId}",
                InvoiceDate = DateTime.UtcNow,
                OrderId = orderId,
                CustomerId = customerId,
                SubTotal = subTotal,
                Tax = tax,
                Total = total
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // 🔹 Insert invoice items manually
            var invoiceItems = orderItems.Select(i => new InvoiceItem
            {
                InvoiceId = invoice.Id,
                ProductName = i.Name,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList();

            _context.InvoiceItems.AddRange(invoiceItems);
            await _context.SaveChangesAsync();

            return invoice;
        }
    }
}
