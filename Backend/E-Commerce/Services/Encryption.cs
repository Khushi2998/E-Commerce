using System.Text;
using System.Security.Cryptography;
using System.Text;

namespace ECommerce.Services
{
        public static class Sha256Hasher
        {
        public static string ComputeSHA256Hash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
                public static bool Verify(string inputPassword, string storedHash)
        {
            var inputHash = ComputeSHA256Hash(inputPassword);
            return inputHash == storedHash;
        }
    

        }
    
}
