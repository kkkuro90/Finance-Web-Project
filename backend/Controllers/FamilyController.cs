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
    public class FamilyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public FamilyController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("members")]
        public async Task<IActionResult> GetMembers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user?.FamilyGroupId == null)
                return Ok(new List<User>());

            var members = await _userManager.Users
                .Where(u => u.FamilyGroupId == user.FamilyGroupId)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Surname,
                    u.Email,
                    IsOwner = u.Id == user.Id
                })
                .ToListAsync();

            return Ok(members);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGroup()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // If user already has a group, remove them from it
            if (user.FamilyGroupId.HasValue)
            {
                var oldGroup = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
                if (oldGroup != null)
                {
                    _context.FamilyGroups.Remove(oldGroup);
                }
            }

            // Create new group
            var newGroup = new FamilyGroup
            {
                Name = $"{user.Name}'s Family",
                OwnerId = user.Id,
                Members = new List<User> { user }
            };
            _context.FamilyGroups.Add(newGroup);
            await _context.SaveChangesAsync();

            // Add user to new group
            user.FamilyGroupId = newGroup.Id;
            user.FamilyRole = "admin";
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "Family group created successfully" });
        }

        [HttpDelete("members/{memberId}")]
        public async Task<IActionResult> RemoveMember(string memberId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // Only group owner can remove members
            if (user.FamilyGroupId == null || user.Id != userId)
                return Forbid();

            var member = await _userManager.FindByIdAsync(memberId);
            if (member == null || member.FamilyGroupId != user.FamilyGroupId)
                return NotFound("Member not found");

            member.FamilyGroupId = null;
            await _userManager.UpdateAsync(member);

            return Ok(new { Message = "Member removed successfully" });
        }

        // Приглашение по email или логину
        [HttpPost("invite")]
        public async Task<IActionResult> Invite([FromBody] InviteRequest model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyGroupId == null) return Forbid();

            // Проверяем, есть ли уже такой пользователь
            var invitedUser = !string.IsNullOrEmpty(model.Email)
                ? await _userManager.FindByEmailAsync(model.Email)
                : (!string.IsNullOrEmpty(model.Login) ? await _userManager.FindByNameAsync(model.Login) : null);

            // Генерируем токен приглашения
            var token = Guid.NewGuid().ToString();

            var invite = new FamilyInvite
            {
                InvitedUserEmail = model.Email ?? string.Empty,
                InvitedUserLogin = model.Login,
                FamilyGroupId = user.FamilyGroupId.Value,
                InviterId = user.Id,
                Token = token,
                CreatedAt = DateTime.UtcNow,
                Accepted = false
            };
            await _context.FamilyInvites.AddAsync(invite);
            await _context.SaveChangesAsync();

            // Здесь можно отправить email или уведомление (заглушка)
            // Если пользователь уже есть, можно сразу добавить уведомление

            return Ok(new { Message = "Приглашение отправлено!", Token = token });
        }

        public class InviteRequest
        {
            public string? Email { get; set; }
            public string? Login { get; set; }
        }

        // Принять приглашение по токену
        [HttpPost("accept-invite")]
        public async Task<IActionResult> AcceptInvite([FromBody] AcceptInviteRequest model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Forbid();

            var invite = await _context.FamilyInvites.FirstOrDefaultAsync(i => i.Token == model.Token && !i.Accepted);
            if (invite == null) return NotFound(new { Message = "Приглашение не найдено или уже принято." });

            // Проверка: совпадает ли email или login
            if (!string.IsNullOrEmpty(invite.InvitedUserEmail) && !string.IsNullOrEmpty(user.Email) && invite.InvitedUserEmail != user.Email)
                return Forbid();
            if (!string.IsNullOrEmpty(invite.InvitedUserLogin) && invite.InvitedUserLogin != user.UserName)
                return Forbid();

            user.FamilyGroupId = invite.FamilyGroupId;
            user.FamilyRole = "member";
            invite.Accepted = true;
            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Вы присоединились к семейной группе!" });
        }

        public class AcceptInviteRequest
        {
            public string Token { get; set; }
        }

        // Установить общий бюджет (только админ)
        [HttpPost("set-budget")]
        public async Task<IActionResult> SetBudget([FromBody] BudgetRequest model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyRole != "admin" || user.FamilyGroupId == null) return Forbid();

            var group = await _context.FamilyGroups.FindAsync(user.FamilyGroupId);
            if (group == null) return NotFound();

            group.Budget = model.Budget;
            await _context.SaveChangesAsync();
            return Ok();
        }

        public class BudgetRequest
        {
            public decimal Budget { get; set; }
        }

        // Получить бюджет и траты по участникам
        [HttpGet("budget")]
        public async Task<IActionResult> GetBudget()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyGroupId == null) return Forbid();

            var group = await _context.FamilyGroups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == user.FamilyGroupId);

            var members = group.Members.Select(m => new {
                m.Id,
                m.Name,
                m.Surname,
                m.Email,
                m.FamilyRole,
                m.Expense
            });

            return Ok(new {
                budget = group.Budget,
                members,
                isAdmin = user.FamilyRole == "admin"
            });
        }

        // Установить бюджет по категории
        [HttpPost("category-budget")]
        public async Task<IActionResult> SetCategoryBudget([FromBody] CategoryBudgetRequest model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyRole != "admin") return Forbid();

            var category = await _context.Categories.FindAsync(model.CategoryId);
            if (category == null) return NotFound();

            category.MonthlyBudget = model.Budget;
            await _context.SaveChangesAsync();
            return Ok();
        }

        public class CategoryBudgetRequest
        {
            public int CategoryId { get; set; }
            public decimal Budget { get; set; }
        }

        // Получить бюджеты по категориям
        [HttpGet("category-budgets")]
        public async Task<IActionResult> GetCategoryBudgets()
        {
            var categories = await _context.Categories
                .Select(c => new { c.Id, c.Name, c.MonthlyBudget })
                .ToListAsync();
            return Ok(categories);
        }

        // Получить все приглашения в семейную группу
        [HttpGet("invites")]
        public async Task<IActionResult> GetInvites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyGroupId == null) return Forbid();

            var invites = await _context.FamilyInvites
                .Where(i => i.FamilyGroupId == user.FamilyGroupId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
            return Ok(invites);
        }

        // Удалить семейную группу
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteGroup()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.FamilyGroupId == null) return Forbid();

            var group = await _context.FamilyGroups.Include(g => g.Members).FirstOrDefaultAsync(g => g.Id == user.FamilyGroupId);
            if (group == null) return NotFound();

            // Удаляем связь у всех участников
            foreach (var member in group.Members.ToList())
            {
                member.FamilyGroupId = null;
                member.FamilyRole = "member";
                await _userManager.UpdateAsync(member);
            }
            _context.FamilyGroups.Remove(group);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Группа удалена" });
        }
    }
} 