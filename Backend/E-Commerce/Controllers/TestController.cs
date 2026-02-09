//using AuthApi.Email;
//using Microsoft.AspNetCore.Mvc;

//[ApiController]
//[Route("api/test")]
//public class TestController : ControllerBase
//{
//    private readonly IEmailService _emailService;

//    public TestController(IEmailService emailService)
//    {
//        _emailService = emailService;
//    }

//    [HttpPost("send")]
//    public async Task<IActionResult> Send()
//    {
//        await _emailService.SendEmailAsync(
//            "gayatriojha2018@gmail.com",
//            "Hello",
//            "Email from NuGet package");

//        return Ok("Email sent");
//    }
//}
