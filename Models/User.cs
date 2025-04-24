using Microsoft.AspNetCore.Identity;

namespace FinanceApp.Models
{
    public class User : IdentityUser
    {
        public string Login { get; set; }
        public string Name { get; set; } 
        public string Surname { get; set; } 
        public decimal Balance { get; set; } // (начальное значение — 0)
        public int? FamilyGroupId { get; set; }
        public FamilyGroup? FamilyGroup { get; set; }
    }
}