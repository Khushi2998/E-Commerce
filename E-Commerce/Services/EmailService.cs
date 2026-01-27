using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendAsync(string to, string subject, string body)
    {
        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        var smtp = new SmtpClient(
            _config["AppSettings:EmailSettings:SmtpServer"]
        )
        {
            Port = int.Parse(_config["AppSettings:EmailSettings:Port"]),
            EnableSsl = true,
            Credentials = new NetworkCredential(
                _config["AppSettings:EmailSettings:From"],
                _config["AppSettings:EmailSettings:Password"]
            )
        };

        var mail = new MailMessage
        {
            From = new MailAddress(
                _config["AppSettings:EmailSettings:From"]
            ),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mail.To.Add(to);

        await smtp.SendMailAsync(mail);
    }

}
