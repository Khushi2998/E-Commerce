namespace ECommerce.DTOs
{
    public class CheckoutDto
    {
        public int AddressId { get; set; }
        public string PaymentMethod { get; set; } = "COD";
    }
}
