using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Migrations;
using ECommerce.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

[ApiController]
[Route("api")]
[Authorize]
public class CheckoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public CheckoutController(AppDbContext context)
    {
        _context = context;
    }
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutDto dto)
    {
        var userId = int.Parse(User.Claims
            .First(c => c.Type.Contains("nameidentifier")).Value);

        // 1️ Fetch selected address
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == dto.AddressId && a.UserId == userId);

        if (address == null)
            return BadRequest("Invalid address selected");

        // 2️ Fetch cart items
        var cartItems = await (
            from c in _context.CartItems
            join p in _context.Products on c.ProductId equals p.Id
            where c.CustomerId == userId
            select new
            {
                c.ProductId,
                c.Quantity,
                ProductName = p.Name,
                Price = p.Price,
                Stock = p.Stock
            }
        ).ToListAsync();

        if (!cartItems.Any())
            return BadRequest("Cart is empty");

        // 3️⃣ Stock check
        foreach (var item in cartItems)
        {
            if (item.Stock < item.Quantity)
                return BadRequest($"{item.ProductName} is out of stock");
        }

        // 4️⃣ Calculate totals
        var subTotal = cartItems.Sum(i => i.Price * i.Quantity);
        var tax = subTotal * 0.08m;
        var total = subTotal + tax;

        // 5️⃣ Create order
        var order = new Order
        {
            CustomerId = userId,
            CreatedAt = DateTime.Now,
            SubTotal = subTotal,
            Tax = tax,
            TotalAmount = total,
            PaymentMethod = dto.PaymentMethod,
            ShippingAddress = $@"
Address: {address.StreetAddress}
City: {address.City}
State: {address.State}
Pincode: {address.Pincode}
".Trim()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // 6️⃣ Order items
        var orderItems = cartItems.Select(i => new OrderItem
        {
            OrderId = order.Id,
            ProductId = i.ProductId,
            Quantity = i.Quantity,
            Price = i.Price,
            Status = OrderItemStatus.Placed
        }).ToList();

        _context.OrderItems.AddRange(orderItems);

        // 7️⃣ COD → reduce stock + clear cart
        if (dto.PaymentMethod == "COD")
        {
            foreach (var item in cartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                product.Stock -= item.Quantity;
            }

            _context.CartItems.RemoveRange(
                _context.CartItems.Where(c => c.CustomerId == userId)
            );
        }

        await _context.SaveChangesAsync();

        return Ok(new { orderId = order.Id });
    }



    //    [HttpPost("checkout")]
    //public async Task<IActionResult> Checkout([FromBody] CheckoutDto dto)
    //{

    //    var userId = int.Parse(User.Claims
    //       .First(c => c.Type.Contains("nameidentifier")).Value);

    //    var cartItems = await (
    //        from c in _context.CartItems
    //        join p in _context.Products
    //            on c.ProductId equals p.Id
    //        where c.CustomerId == userId
    //        select new
    //        {
    //            c.ProductId,
    //            c.Quantity,
    //            Price = p.Price,
    //            ProductName = p.Name
    //        }
    //    ).ToListAsync();

    //    if (!cartItems.Any())
    //        return BadRequest("Cart is empty");
    //    foreach (var item in cartItems)
    //    {
    //        var product = await _context.Products.FindAsync(item.ProductId);

    //        if (product.Stock < item.Quantity)
    //            return BadRequest($"{product.Name} is out of stock");

    //        product.Stock -= item.Quantity; 
    //    }
    //    var subTotal = cartItems.Sum(i => i.Price * i.Quantity);
    //    var tax = subTotal * 0.08m;
    //    var total = subTotal + tax;

    //    var ShippingAddress = $@"
    //    Name: {dto.FullName}
    //    Phone: {dto.Phone}
    //    Address: {dto.AddressLine}
    //    City: {dto.City}
    //    State: {dto.State}
    //    Pincode: {dto.Pincode}
    //    ".Trim();

    //    var order = new Order
    //    {
    //        CustomerId = userId,
    //        CreatedAt = DateTime.Now,
    //        SubTotal=subTotal,
    //        Tax = tax,
    //        TotalAmount = total,
    //        PaymentMethod = dto.PaymentMethod,
    //        ShippingAddress = dto.AddressLine
    //    };

    //    _context.Orders.Add(order);
    //    await _context.SaveChangesAsync();

    //    var orderItems = cartItems.Select(i => new OrderItem
    //    {
    //        OrderId = order.Id,
    //        ProductId = i.ProductId,
    //        Status = OrderItemStatus.Placed,
    //        Quantity = i.Quantity,
    //        Price = i.Price
    //    }).ToList();

    //    _context.OrderItems.AddRange(orderItems);

    //    // Clear cart
    //    _context.CartItems.RemoveRange(
    //        _context.CartItems.Where(c => c.CustomerId == userId)
    //    );

    //    await _context.SaveChangesAsync();

    //    return Ok(new { message = "Order placed successfully", orderId = order.Id });
    //}


}

