namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!; // "income" or "expense"
        public ICollection<Operation> Operations { get; set; } = new List<Operation>();
        public decimal? MonthlyBudget { get; set; }
    }
}