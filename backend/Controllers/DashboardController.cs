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
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            // Получаем операции за текущий месяц
            var operations = await _context.Operations
                .Include(o => o.Category)
                .Where(o => o.UserId == userId && o.Date >= monthStart && o.Date <= monthEnd)
                .ToListAsync();

            // Считаем доходы и расходы по категориям
            var categoryStats = operations
                .GroupBy(o => o.Category)
                .Select(g => new
                {
                    Category = g.Key.Name,
                    Type = g.Key.Type,
                    Total = g.Sum(o => o.Amount)
                })
                .ToList();

            // Считаем общие суммы
            var totalIncome = operations.Where(o => o.Amount > 0).Sum(o => o.Amount);
            var totalExpense = operations.Where(o => o.Amount < 0).Sum(o => Math.Abs(o.Amount));

            // Получаем последние операции
            var recentOperations = await _context.Operations
                .Include(o => o.Category)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.Date)
                .Take(5)
                .ToListAsync();

            // Если пользователь в семейной группе, получаем общую статистику
            var familyStats = new
            {
                TotalIncome = 0m,
                TotalExpense = 0m,
                Members = new List<object>()
            };

            if (user.FamilyGroupId != null)
            {
                var familyMembers = await _context.Users
                    .Where(u => u.FamilyGroupId == user.FamilyGroupId)
                    .ToListAsync();

                var familyOperations = await _context.Operations
                    .Include(o => o.User)
                    .Where(o => o.User.FamilyGroupId == user.FamilyGroupId && o.Date >= monthStart && o.Date <= monthEnd)
                    .ToListAsync();

                var members = familyMembers.Select(m => new
                {
                    m.Name,
                    m.Surname,
                    m.Balance,
                    m.Income,
                    m.Expense
                }).ToList<object>();

                familyStats = new
                {
                    TotalIncome = familyOperations.Where(o => o.Amount > 0).Sum(o => o.Amount),
                    TotalExpense = familyOperations.Where(o => o.Amount < 0).Sum(o => Math.Abs(o.Amount)),
                    Members = members
                };
            }

            return Ok(new
            {
                UserStats = new
                {
                    user.Balance,
                    user.Income,
                    user.Expense
                },
                MonthStats = new
                {
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    CategoryStats = categoryStats
                },
                RecentOperations = recentOperations,
                FamilyStats = familyStats
            });
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Balance,
                user.Income,
                user.Expense
            });
        }

        [HttpGet("category-stats")]
        public async Task<IActionResult> GetCategoryStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var monthStart = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var operations = await _context.Operations
                .Include(o => o.Category)
                .Where(o => o.UserId == userId && o.Date >= monthStart && o.Date <= monthEnd)
                .ToListAsync();

            var categoryStats = operations
                .GroupBy(o => o.Category)
                .Select(g => new
                {
                    Category = g.Key.Name,
                    Type = g.Key.Type,
                    Total = g.Sum(o => o.Amount)
                })
                .ToList();

            return Ok(categoryStats);
        }
    }
}