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
        private readonly FinanceContext _context;
        private readonly ApplicationDbContext _appContext;
        private readonly UserManager<User> _userManager;

        public OperationsController(
            FinanceContext context,
            ApplicationDbContext appContext,
            UserManager<User> userManager)
        {
            _context = context;
            _appContext = appContext;
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

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Operation op)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // Validate category exists
            var category = await _context.Categories.FindAsync(op.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            // Set user and date
            op.UserId = userId;
            op.Date = DateTime.UtcNow;

            // Update user balance
            user.Balance += op.Amount;
            if (op.Amount > 0)
                user.Income += op.Amount;
            else
                user.Expense += Math.Abs(op.Amount);

            await _userManager.UpdateAsync(user);

            _context.Operations.Add(op);
            await _context.SaveChangesAsync();

            return Ok(op);
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
            existingOp.Date = op.Date;

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