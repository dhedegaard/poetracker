using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Core.Models {
    public class Account {
        [Key]
        public string AccountName { get; set; }

        public override string ToString() =>
            $"<{nameof(Account)} AccountName=\"{AccountName}\">";

        public static void OnModelCreating(ModelBuilder modelBuilder) {
            var entity = modelBuilder.Entity<Account>();

            entity.HasKey(e => e.AccountName);

            entity.HasData(
                new Account { AccountName = "johnconor" },
                new Account { AccountName = "bravoscript" });
        }
    }
}
