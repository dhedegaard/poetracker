using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models {
    public class Datapoint {
        /// <summary>
        /// The primary key, as a serial.
        /// </summary>
        [Key]
        public int? Id { get; set; }
        [Required]
        public DateTimeOffset Timestamp { get; set; }
        [Required]
        public string Charname { get; set; }
        [Required]
        public int GlobalRank { get; set; }
        [Required]
        public int Experience { get; set; }
        [Required]
        public int Level { get; set; }
        [Required]
        public string Class { get; set; }
        [Required]
        public bool Online { get; set; }
        [Required]
        public bool Dead { get; set; }

        [Required]
        public League League { get; set; }
        public string LeagueId { get; set; }

        [Required]
        public Account Account { get; set; }
        public string AccountId { get; set; }

        public override string ToString() =>
                $"<{nameof(Datapoint)} id={Id}, timestamp={Timestamp}, charname={Charname}>";

        public static void OnModelCreating(ModelBuilder modelBuilder) {
            var entity = modelBuilder.Entity<Datapoint>();

            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Charname, e.Timestamp });
        }
    }
}
