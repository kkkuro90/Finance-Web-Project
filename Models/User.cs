using Microsoft.AspNetCore.Identity;

namespace FinanceApp.Models
{
    public class User : IdentityUser
    {
        public string Login { get; set; }
        public string FirstName { get; set; } // Имя
        public string LastName { get; set; } // Фамилия
        public decimal Balance { get; set; } = 0; // Баланс (начальное значение — 0)
        public int? FamilyGroupId { get; set; }
        public FamilyGroup? FamilyGroup { get; set; }
    }
}