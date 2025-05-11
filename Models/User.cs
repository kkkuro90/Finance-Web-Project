using Microsoft.AspNetCore.Identity;

namespace FinanceApp.Models
{
    public class User : IdentityUser
    {
        public string Login { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public decimal Balance { get; set; }
        public int? FamilyGroupId { get; set; }
        public FamilyGroup? FamilyGroup { get; set; }
        public decimal Income { get; set; } = 0;
        public decimal Expense { get; set; } = 0;
    }
}