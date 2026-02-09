using System.ComponentModel.DataAnnotations;

namespace ECommerce.Models
{
    public class Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be 6 digits")]
        public string Pincode { get; set; }
        public string Label { get; set; }
        public bool IsDefault { get; set; }
    }
}
