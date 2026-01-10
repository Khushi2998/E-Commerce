using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] dynamic data)
        {
            int amount = data.amount; // amount in rupees

            RazorpayClient client = new RazorpayClient(
                _configuration["Razorpay:Key"],
                _configuration["Razorpay:Secret"]
            );

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", amount * 100); // in paise
            options.Add("currency", "INR");
            options.Add("receipt", "order_rcptid_" + DateTime.Now.Ticks);

            Order order = client.Order.Create(options);

            return Ok(order.Attributes); // send order details to frontend
        }

        // 2️⃣ Verify Payment
        [HttpPost("verify-payment")]
        public IActionResult VerifyPayment([FromBody] dynamic data)
        {
            string orderId = data.razorpay_order_id;
            string paymentId = data.razorpay_payment_id;
            string signature = data.razorpay_signature;

            string keySecret = _configuration["Razorpay:Secret"];
            string payload = orderId + "|" + paymentId;

            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                if (generatedSignature == signature)
                {
                    return Ok(new { status = "success" });
                }
                else
                {
                    return BadRequest(new { status = "failure" });
                }
            }
        }
    }
}
