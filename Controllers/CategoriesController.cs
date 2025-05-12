using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly FinanceContext _context;
        public CategoriesController(FinanceContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Categories.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Category cat)
        {
            if (string.IsNullOrWhiteSpace(cat.Name) || string.IsNullOrWhiteSpace(cat.Type))
                return BadRequest("Name and Type are required");

            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok(cat);
        }
    }
}