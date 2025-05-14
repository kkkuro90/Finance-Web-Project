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
    public class DashboardController : ControllerBase
    {
        private readonly FinanceContext _context;
        private readonly ApplicationDbContext _appContext;
        private readonly UserManager<User> _userManager;

        public DashboardController(
            FinanceContext context,
            ApplicationDbContext appContext,
            UserManager<User> userManager)
        {
            _context = context;
            _appContext = appContext;
            _userManager = userManager;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var operations = await _context.Operations
                .Include(o => o.Category)
                .Include(o => o.User)
                .Where(o => o.UserId == userId || (user.FamilyGroupId != null && o.User.FamilyGroupId == user.FamilyGroupId))
                .ToListAsync();

            var income = operations.Where(o => o.Amount > 0).Sum(o => o.Amount);
            var expense = operations.Where(o => o.Amount < 0).Sum(o => o.Amount);

            return Ok(new
            {
                Balance = user.Balance,
                Income = user.Income,
                Expense = user.Expense
            });
        }

        [HttpGet("category-stats")]
        public async Task<IActionResult> GetCategoryStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var stats = await _context.Operations
                .Include(o => o.Category)
                .Include(o => o.User)
                .Where(o => (o.UserId == userId || (user.FamilyGroupId != null && o.User.FamilyGroupId == user.FamilyGroupId)) && o.Category.Type == "expense")
                .GroupBy(o => o.Category.Name)
                .Select(g => new
                {
                    Category = g.Key,
                    Total = g.Sum(x => x.Amount)
                })
                .ToListAsync();

            return Ok(stats);
        }
    }
}