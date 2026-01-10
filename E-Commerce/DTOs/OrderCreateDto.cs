using ECommerce.DTOs;

public class OrderCreateDto
{
    public int CustomerId { get; set; }
    public List<OrderItemDto> Items { get; set; }
}



