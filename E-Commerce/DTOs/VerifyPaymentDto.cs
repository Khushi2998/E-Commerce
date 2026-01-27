using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerce.DTOs
{
    public class VerifyPaymentDto
    {
        [JsonPropertyName("razorpay_order_id")]
        [Required]
        public string RazorpayOrderId { get; set; }

        [JsonPropertyName("razorpay_payment_id")]
        [Required]
        public string RazorpayPaymentId { get; set; }

        [JsonPropertyName("razorpay_signature")]
        [Required]
        public string RazorpaySignature { get; set; }

        public int OrderId { get; set; }
    }
}
