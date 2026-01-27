namespace ECommerce.DTOs
{
    public class CheckoutDto
    {
        public string PaymentMethod { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string AddressLine { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Pincode { get; set; }
    }
}
