using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Core.Models {
    public class Account {
        [Key]
        public string AccountName { get; set; }
        public string TwitchUsername { get; set; }

        public string TwitchURL {
            get => !string.IsNullOrEmpty(TwitchUsername) ? $"https://www.twitch.tv/{TwitchUsername}" : null;
        }

        public override string ToString() =>
            $"<{nameof(Account)} AccountName=\"{AccountName}\" TwitchUsername=\"{TwitchUsername}\">";

        public static void OnModelCreating(ModelBuilder modelBuilder) {
            var entity = modelBuilder.Entity<Account>();

            entity.HasKey(e => e.AccountName);

            // Some popular streamers :)
            entity.HasData(
                new Account { AccountName = "nugiyen", TwitchUsername = "nugiyen" },
                new Account { AccountName = "helman", TwitchUsername = "Helman" },
                new Account { AccountName = "raizqt", TwitchUsername = "RaizQT" },
                new Account { AccountName = "dclara", TwitchUsername = "DCLara1" },
                new Account { AccountName = "havoc6", TwitchUsername = "havoc616" },
                new Account { AccountName = "alkaizerx", TwitchUsername = "alkaizerx" },
                new Account { AccountName = "pinytenis", TwitchUsername = "Bakedchicken" },
                new Account { AccountName = "cohhcarnage", TwitchUsername = "cohhcarnage" }
            );
        }
    }
}
