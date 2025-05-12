using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class FinanceContext : DbContext
    {
        public FinanceContext(DbContextOptions<FinanceContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Operation> Operations { get; set; }
    }
}