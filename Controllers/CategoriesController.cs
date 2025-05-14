using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly FinanceContext _context;
        public CategoriesController(FinanceContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Categories.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Category cat)
        {
            if (string.IsNullOrWhiteSpace(cat.Name) || string.IsNullOrWhiteSpace(cat.Type))
                return BadRequest("Name and Type are required");

            if (cat.Type != "income" && cat.Type != "expense")
                return BadRequest("Type must be either 'income' or 'expense'");

            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok(cat);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category cat)
        {
            if (id != cat.Id) return BadRequest();
            if (string.IsNullOrWhiteSpace(cat.Name) || string.IsNullOrWhiteSpace(cat.Type))
                return BadRequest("Name and Type are required");

            if (cat.Type != "income" && cat.Type != "expense")
                return BadRequest("Type must be either 'income' or 'expense'");

            _context.Entry(cat).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            // Check if category has any operations
            var hasOperations = await _context.Operations.AnyAsync(o => o.CategoryId == id);
            if (hasOperations)
                return BadRequest("Cannot delete category with existing operations");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}