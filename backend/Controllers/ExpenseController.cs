using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExpenseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить все расходы
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Include(e => e.User)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Ok(expenses);
        }

        // Получить расход по id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var expense = await _context.Expenses
                .Include(e => e.Category)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        // Добавить расход
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Expense expense)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // Validate category exists
            var category = await _context.Categories.FindAsync(expense.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            // Проверка превышения бюджета по категории
            if (category.MonthlyBudget.HasValue)
            {
                var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                var spent = await _context.Expenses
                    .Where(e => e.CategoryId == category.Id && e.Date >= monthStart)
                    .SumAsync(e => e.Amount);
                if (spent + expense.Amount > category.MonthlyBudget.Value)
                {
                    return BadRequest("Бюджет по категории превышен!");
                }
            }

            // Проверка превышения общего бюджета семьи
            if (user.FamilyGroupId != null)
            {
                var group = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
                if (group != null && group.Budget > 0)
                {
                    var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                    var familySpent = await _context.Expenses
                        .Include(e => e.User)
                        .Where(e => e.User.FamilyGroupId == group.Id && e.Date >= monthStart)
                        .SumAsync(e => e.Amount);
                    if (familySpent + expense.Amount > group.Budget)
                    {
                        return BadRequest("Общий семейный бюджет превышен!");
                    }
                }
            }

            expense.UserId = userId;
            expense.Date = DateTime.UtcNow;

            // Update user balance
            user.Balance -= expense.Amount;
            user.Expense += expense.Amount;

            await _context.SaveChangesAsync();

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(expense);
        }

        // Изменить расход
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Expense expense)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null || existingExpense.UserId != userId)
                return NotFound();

            // Validate category exists
            var category = await _context.Categories.FindAsync(expense.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            // Проверка превышения бюджета по категории
            if (category.MonthlyBudget.HasValue)
            {
                var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                var spent = await _context.Expenses
                    .Where(e => e.CategoryId == category.Id && e.Date >= monthStart && e.Id != id)
                    .SumAsync(e => e.Amount);
                if (spent + expense.Amount > category.MonthlyBudget.Value)
                {
                    return BadRequest("Бюджет по категории превышен!");
                }
            }

            // Проверка превышения общего бюджета семьи
            if (user.FamilyGroupId != null)
            {
                var group = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
                if (group != null && group.Budget > 0)
                {
                    var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                    var familySpent = await _context.Expenses
                        .Include(e => e.User)
                        .Where(e => e.User.FamilyGroupId == group.Id && e.Date >= monthStart && e.Id != id)
                        .SumAsync(e => e.Amount);
                    if (familySpent + expense.Amount > group.Budget)
                    {
                        return BadRequest("Общий семейный бюджет превышен!");
                    }
                }
            }

            // Update user balance
            user.Balance += existingExpense.Amount;
            user.Expense -= existingExpense.Amount;

            user.Balance -= expense.Amount;
            user.Expense += expense.Amount;

            await _context.SaveChangesAsync();

            // Update expense
            existingExpense.CategoryId = expense.CategoryId;
            existingExpense.Description = expense.Description;
            existingExpense.Amount = expense.Amount;
            existingExpense.Date = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Удалить расход
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null || expense.UserId != userId)
                return NotFound();

            // Update user balance
            user.Balance += expense.Amount;
            user.Expense -= expense.Amount;

            await _context.SaveChangesAsync();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}