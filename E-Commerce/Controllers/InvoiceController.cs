using ECommerce.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ECommerce.Controllers
{
    [Route("api/invoice")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;
        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("order/{orderId:int}")]
        public async Task<IActionResult> GetInvoiceByOrder([FromRoute] int orderId)
        {
            Console.WriteLine("Invoice endpoint HIT for orderId: {orderId}");
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.OrderId == orderId);

            if (invoice == null)
                return NotFound("Invoice not found");

            var items = await _context.InvoiceItems
                .Where(i => i.InvoiceId == invoice.Id)
                .ToListAsync();

            return Ok(new
            {
                invoice.Id,
                invoice.InvoiceNumber,
                invoice.InvoiceDate,
                invoice.SubTotal,
                invoice.Tax,
                invoice.Total,
                items
            });
        }

    }
}