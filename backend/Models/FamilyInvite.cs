namespace backend.Models
{
    public class FamilyInvite
    {
        public int Id { get; set; }
        public string InvitedUserEmail { get; set; } = null!;
        public string? InvitedUserLogin { get; set; }
        public int FamilyGroupId { get; set; }
        public string InviterId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool Accepted { get; set; } = false;
    }
} 