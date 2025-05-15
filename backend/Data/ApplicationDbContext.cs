using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<FamilyGroup> FamilyGroups { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<FamilyInvite> FamilyInvites { get; set; }
        public DbSet<Operation> Operations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Настройка отношения между User и FamilyGroup
            modelBuilder.Entity<User>()
                .HasOne(u => u.FamilyGroup)
                .WithMany(fg => fg.Members)
                .HasForeignKey(u => u.FamilyGroupId)
                .IsRequired(false); // Дополнительно: если пользователь может не принадлежать группе

            // Настройка названия таблицы для Operations
            modelBuilder.Entity<Operation>()
                .ToTable("Operations");
        }
    }
}