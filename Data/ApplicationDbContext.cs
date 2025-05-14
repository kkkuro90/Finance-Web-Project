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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Настройка отношения между User и FamilyGroup
            modelBuilder.Entity<User>()
                .HasOne(u => u.FamilyGroup)
                .WithMany(fg => fg.Members)
                .HasForeignKey(u => u.FamilyGroupId)
                .IsRequired(false); // Дополнительно: если пользователь может не принадлежать группе
        }
    }
}