using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OperationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public OperationsController(
            ApplicationDbContext context,
            UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var operations = await _context.Operations
                .Include(o => o.Category)
                .Include(o => o.User)
                .Where(o => o.UserId == userId || (user.FamilyGroupId != null && o.User.FamilyGroupId == user.FamilyGroupId))
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            return Ok(operations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var operation = await _context.Operations
                .Include(o => o.Category)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id && (o.UserId == userId || (user.FamilyGroupId != null && o.User.FamilyGroupId == user.FamilyGroupId)));

            if (operation == null)
                return NotFound();

            return Ok(operation);
        }

        public class OperationCreateDto
        {
            public int CategoryId { get; set; }
            public decimal Amount { get; set; }
            public string Description { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] OperationCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // Validate category exists
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            // Проверка превышения бюджета по категории
            if (category.MonthlyBudget.HasValue && dto.Amount < 0)
            {
                var monthStart = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
                var spent = await _context.Operations
                    .Where(o => o.CategoryId == category.Id && o.Date >= monthStart && o.Amount < 0)
                    .SumAsync(o => Math.Abs(o.Amount));
                if (spent + Math.Abs(dto.Amount) > category.MonthlyBudget.Value)
                {
                    return BadRequest("Бюджет по категории превышен!");
                }
            }

            // Проверка превышения общего бюджета семьи
            if (user.FamilyGroupId != null)
            {
                var group = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
                if (group != null && group.Budget > 0 && dto.Amount < 0)
                {
                    var monthStart = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
                    var familySpent = await _context.Operations
                        .Include(o => o.User)
                        .Where(o => o.User.FamilyGroupId == group.Id && o.Date >= monthStart && o.Amount < 0)
                        .SumAsync(o => Math.Abs(o.Amount));
                    if (familySpent + Math.Abs(dto.Amount) > group.Budget)
                    {
                        return BadRequest("Общий семейный бюджет превышен!");
                    }
                }
            }

            // Создаём новый объект операции
            var newOp = new Operation
            {
                CategoryId = dto.CategoryId,
                Description = dto.Description,
                Amount = dto.Amount,
                UserId = userId,
                Date = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)
            };

            // Update user balance
            user.Balance += newOp.Amount;
            if (newOp.Amount > 0)
                user.Income += newOp.Amount;
            else
                user.Expense += Math.Abs(newOp.Amount);

            await _userManager.UpdateAsync(user);

            _context.Operations.Add(newOp);
            await _context.SaveChangesAsync();

            // Возвращаем только нужные поля (DTO)
            return Ok(new {
                newOp.Id,
                newOp.Date,
                newOp.CategoryId,
                CategoryName = category.Name,
                newOp.Description,
                newOp.Amount
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Operation op)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var existingOp = await _context.Operations.FindAsync(id);
            if (existingOp == null || existingOp.UserId != userId)
                return NotFound();

            // Validate category exists
            var category = await _context.Categories.FindAsync(op.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            // Проверка превышения бюджета по категории
            if (category.MonthlyBudget.HasValue && op.Amount < 0)
            {
                var monthStart = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
                var spent = await _context.Operations
                    .Where(o => o.CategoryId == category.Id && o.Date >= monthStart && o.Amount < 0)
                    .SumAsync(o => Math.Abs(o.Amount));
                if (spent + Math.Abs(op.Amount) > category.MonthlyBudget.Value)
                {
                    return BadRequest("Бюджет по категории превышен!");
                }
            }

            // Проверка превышения общего бюджета семьи
            if (user.FamilyGroupId != null)
            {
                var group = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
                if (group != null && group.Budget > 0 && op.Amount < 0)
                {
                    var monthStart = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
                    var familySpent = await _context.Operations
                        .Include(o => o.User)
                        .Where(o => o.User.FamilyGroupId == group.Id && o.Date >= monthStart && o.Amount < 0)
                        .SumAsync(o => Math.Abs(o.Amount));
                    if (familySpent + Math.Abs(op.Amount) > group.Budget)
                    {
                        return BadRequest("Общий семейный бюджет превышен!");
                    }
                }
            }

            // Update user balance
            user.Balance -= existingOp.Amount;
            if (existingOp.Amount > 0)
                user.Income -= existingOp.Amount;
            else
                user.Expense -= Math.Abs(existingOp.Amount);

            user.Balance += op.Amount;
            if (op.Amount > 0)
                user.Income += op.Amount;
            else
                user.Expense += Math.Abs(op.Amount);

            await _userManager.UpdateAsync(user);

            // Update operation
            existingOp.CategoryId = op.CategoryId;
            existingOp.Description = op.Description;
            existingOp.Amount = op.Amount;
            // Исправление: дата всегда UTC
            if (op.Date == default)
                existingOp.Date = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);
            else
                existingOp.Date = DateTime.SpecifyKind(op.Date, DateTimeKind.Utc);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var op = await _context.Operations.FindAsync(id);
            if (op == null || op.UserId != userId)
                return NotFound();

            // Update user balance
            user.Balance -= op.Amount;
            if (op.Amount > 0)
                user.Income -= op.Amount;
            else
                user.Expense -= Math.Abs(op.Amount);

            await _userManager.UpdateAsync(user);

            _context.Operations.Remove(op);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}