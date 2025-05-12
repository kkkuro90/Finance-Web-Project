using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OperationsController : ControllerBase
    {
        private readonly FinanceContext _context;
        public OperationsController(FinanceContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Operations.Include(o => o.Category).OrderByDescending(o => o.Date).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Add(Operation op)
        {
            _context.Operations.Add(op);
            await _context.SaveChangesAsync();
            return Ok(op);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Operation op)
        {
            if (id != op.Id) return BadRequest();
            _context.Entry(op).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var op = await _context.Operations.FindAsync(id);
            if (op == null) return NotFound();
            _context.Operations.Remove(op);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}