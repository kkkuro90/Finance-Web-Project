using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly FinanceContext _context;
        public DashboardController(FinanceContext context) => _context = context;

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var income = await _context.Operations.Where(o => o.Category.Type == "income").SumAsync(o => o.Amount);
            var expense = await _context.Operations.Where(o => o.Category.Type == "expense").SumAsync(o => o.Amount);
            return Ok(new
            {
                Balance = income + expense,
                Income = income,
                Expense = expense
            });
        }

        [HttpGet("category-stats")]
        public async Task<IActionResult> GetCategoryStats()
        {
            var stats = await _context.Operations
                .Where(o => o.Category.Type == "expense")
                .GroupBy(o => o.Category.Name)
                .Select(g => new
                {
                    Category = g.Key,
                    Total = g.Sum(x => x.Amount)
                }).ToListAsync();
            return Ok(stats);
        }
    }
}