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
                Name = $"{user.Name}'s Family"
            };
            _context.FamilyGroups.Add(newGroup);
            await _context.SaveChangesAsync();

            // Add user to new group
            user.FamilyGroupId = newGroup.Id;
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
    }
} 