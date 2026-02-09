using ECommerce.DTOs;
using ECommerce.Models;

namespace ECommerce.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllAsync();
        Task<ProductResponseDto> GetByIdAsync(int id);
        Task<ProductResponseDto> CreateAsync(ProductCreateDto dto);
        Task<bool> UpdateAsync(int id, ProductUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
