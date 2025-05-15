using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }
        // Регистрация пользователя
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = model.Login, // UserName = Login (для входа по логину)
                Email = model.Email,
                Login = model.Login,
                Name = model.Name,
                Surname = model.Surname,
                Balance = 0,
                FamilyRole = "member"
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "User registered successfully!" });
        }

        // Вход пользователя (по логину или email)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Сначала ищем по логину, если не найден — ищем по email
            var user = await _userManager.FindByNameAsync(model.Login);
            if (user == null)
                user = await _userManager.FindByEmailAsync(model.Login);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { Message = "Invalid login or password." });

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            });
        }

        // Получение данных профиля
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User not found." });

            return Ok(new
            {
                Login = user.Login,
                Surname = user.Surname,
                Name = user.Name,
                Email = user.Email,
                Balance = user.Balance,
                Income = user.Income,
                Expense = user.Expense
            });
        }

        [Authorize]
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User not found." });

            // Пример: получаем доходы и расходы пользователя
            var incomes = await _context.Expenses
                .Where(e => e.User.Id == userId && e.Amount > 0)
                .SumAsync(e => e.Amount);

            var expenses = await _context.Expenses
                .Where(e => e.User.Id == userId && e.Amount < 0)
                .SumAsync(e => e.Amount);

            var totalBalance = user.Balance;

            return Ok(new
            {
                totalBalance = user.Balance,
                incomes = user.Income,
                expenses = user.Expense
            });
        }

        [Authorize]
        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User not found." });

            // Обновляем имя и email
            user.Name = model.Name ?? user.Name;
            user.Email = model.Email ?? user.Email;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Если нужно сменить пароль
            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passResult = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
                if (!passResult.Succeeded)
                    return BadRequest(passResult.Errors);
            }

            return Ok(new { Message = "Профиль обновлён!" });
        }

        [Authorize]
        [HttpPost("add-income")]
        public async Task<IActionResult> AddIncome([FromBody] AddIncomeModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User not found." });

            user.Income += model.Amount;
            user.Balance += model.Amount; // если общий баланс должен увеличиваться

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Доход добавлен!", Income = user.Income, Balance = user.Balance });
        }

        [Authorize]
        [HttpPost("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User not found." });

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Аккаунт удалён!" });
        }
    }

    public class RegisterModel
    {
        public string Login { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginModel
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class UpdateProfileModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? NewPassword { get; set; }
    }

    public class AddIncomeModel
    {
        public decimal Amount { get; set; }
    }
}