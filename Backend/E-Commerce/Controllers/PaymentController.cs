using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using ECommerce.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;

namespace ECommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly InvoiceService _invoiceService;
        public PaymentController(IConfiguration configuration, AppDbContext context, InvoiceService invoiceService)
        {
            _configuration = configuration;
            _context = context;
            _invoiceService = invoiceService;
        }

        // ===============================
        // CREATE RAZORPAY ORDER
        // ===============================
        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] CheckoutResponseDto request)
        {
            var order = _context.Orders.Find(request.OrderId);
            if (order == null)
                return BadRequest("Order not found");

            if (order.TotalAmount <= 0)
                return BadRequest("Invalid order amount");

            RazorpayClient client = new RazorpayClient(
                _configuration["Razorpay:Key"],
                _configuration["Razorpay:Secret"]
            );

            var options = new Dictionary<string, object>
            {
                { "amount", (int)(order.TotalAmount * 100) }, // rupees → paise
                { "currency", "INR" },
                { "receipt", $"order_{order.Id}" }
            };

            var razorpayOrder = client.Order.Create(options);

            // VERY IMPORTANT: SAVE RAZORPAY ORDER ID
            order.RazorpayOrderId = razorpayOrder.Attributes["id"].ToString();
            _context.SaveChanges();

            return Ok(new
            {
                razorpayOrderId = order.RazorpayOrderId,
                amount = order.TotalAmount
            });
        }

 
        [HttpPost("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentDto request)
        {
            var order = _context.Orders
                .Include(o => o.OrderItems) // include OrderItems
                .FirstOrDefault(o => o.Id == request.OrderId);

            if (order == null)
                return BadRequest("Order not found");

            // Signature verification
            string payload = $"{request.RazorpayOrderId}|{request.RazorpayPaymentId}";
            string secret = _configuration["Razorpay:Secret"];

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var generatedSignature = BitConverter
                .ToString(hash)
                .Replace("-", "")
                .ToLower();

            if (generatedSignature != request.RazorpaySignature)
                return BadRequest("Payment verification failed");

            // PAYMENT SUCCESS — update each OrderItem
            foreach (var item in order.OrderItems)
            {
                item.Status = OrderItemStatus.Placed; //  update OrderItem status
            }

            // Update payment info in Order
            order.RazorpayOrderId = request.RazorpayOrderId;
            order.RazorpayPaymentId = request.RazorpayPaymentId;
            order.PaidAt = DateTime.UtcNow;
            //Stock reduced
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                if (product.Stock < item.Quantity)
                    return BadRequest($"{product.Name} is out of stock");

                product.Stock -= item.Quantity;

                item.Status = OrderItemStatus.Placed;
            }

            // Clear cart ONLY NOW
            var cartItems = _context.CartItems
                .Where(c => c.CustomerId == order.CustomerId);

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            var invoice = await _invoiceService.CreateInvoice(order.Id, order.CustomerId);

            return Ok(new
            {
                message = "Payment verified successfully",
                orderId = order.Id,
                invoiceId = invoice.Id
            });
        }

    }

}
