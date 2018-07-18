using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core {
    public class PoeContext : DbContext {
        public PoeContext() { }
        public PoeContext(DbContextOptions<PoeContext> options) : base(options) { }

        public DbSet<Datapoint> Datapoints { get; set; }
        public DbSet<League> Leagues { get; set; }
        public DbSet<Account> Accounts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder
                .UseNpgsql("Server=localhost;Database=poetracker;Username=poetracker;Password=poetracker123");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            Datapoint.OnModelCreating(modelBuilder);
            League.OnModelCreating(modelBuilder);
            Account.OnModelCreating(modelBuilder);
        }
    }

    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PoeContext> {
        public PoeContext CreateDbContext(string[] args) =>
            new PoeContext();
    }
}
