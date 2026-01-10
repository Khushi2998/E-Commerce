namespace ECommerce.DTOs
{
    public class FeedbackResponseDto
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public CustomerMiniDto Customer { get; set; }
    }
}
