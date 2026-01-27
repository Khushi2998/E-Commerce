using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using ECommerce.Services;
using Microsoft.AspNetCore.Mvc;
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

        // ===============================
        // VERIFY PAYMENT
        // ===============================
        [HttpPost("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentDto request)
        {
            // Debug logs (remove later)
            Console.WriteLine("===== PAYMENT VERIFY =====");
            Console.WriteLine($"OrderId: {request.OrderId}");
            Console.WriteLine($"RazorpayOrderId: {request.RazorpayOrderId}");
            Console.WriteLine($"RazorpayPaymentId: {request.RazorpayPaymentId}");
            Console.WriteLine($"RazorpaySignature: {request.RazorpaySignature}");

            var order = _context.Orders.Find(request.OrderId);
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

            // PAYMENT SUCCESS
            order.Status = OrderStatus.Placed;
            order.RazorpayOrderId = request.RazorpayOrderId;
            order.RazorpayPaymentId = request.RazorpayPaymentId;
            order.PaidAt = DateTime.UtcNow;

            _context.SaveChanges();
            var invoice = await _invoiceService.CreateInvoice(order.Id, order.CustomerId);

            return Ok(new
            {
                message = "Payment verified successfully",
                orderId = order.Id,
                invoiceId=invoice.Id
            });
        }
    }
}
