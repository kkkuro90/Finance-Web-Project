namespace backend.Models
{
    public class FamilyGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Budget { get; set; }
        public string OwnerId { get; set; }
        public ICollection<User> Members { get; set; } = new List<User>();
    }
}