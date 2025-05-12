using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly FinanceContext _context;
        public ExpenseController(FinanceContext context) => _context = context;

        // Получить все расходы
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var expenses = await _context.Set<Expense>()
                .Include(e => e.Category)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
            return Ok(expenses);
        }

        // Получить расход по id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var expense = await _context.Set<Expense>()
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null) return NotFound();
            return Ok(expense);
        }

        // Добавить расход
        [HttpPost]
        public async Task<IActionResult> Add(Expense expense)
        {
            _context.Set<Expense>().Add(expense);
            await _context.SaveChangesAsync();
            return Ok(expense);
        }

        // Изменить расход
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Expense expense)
        {
            if (id != expense.Id) return BadRequest();
            _context.Entry(expense).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Удалить расход
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var expense = await _context.Set<Expense>().FindAsync(id);
            if (expense == null) return NotFound();
            _context.Set<Expense>().Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}