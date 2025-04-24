using Microsoft.AspNetCore.Identity;

namespace FinanceApp.Models
{
    public class User : IdentityUser
    {
        public string Login { get; set; }
        public int? FamilyGroupId { get; set; }
        public FamilyGroup? FamilyGroup { get; set; }
    }
}