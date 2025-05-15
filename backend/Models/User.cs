using Microsoft.AspNetCore.Identity;

namespace backend.Models
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
        public string FamilyRole { get; set; } // "admin" или "member"
        public override string? Email { get; set; }
    }
}