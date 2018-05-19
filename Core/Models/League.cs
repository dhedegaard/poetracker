using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models {
    public class League {
        /// <summary>
        ///  The ID of the given ladder against the POE API.
        /// </summary>
        [Key]
        public string Id { get; set; }

        /// <summary>
        /// When the given league started.
        /// </summary>
        [Required]
        public DateTimeOffset StartAt { get; set; }

        /// <summary>
        /// When the given league is going to end, if it does.
        /// </summary>
        public DateTimeOffset? EndAt { get; set; }

        public override string ToString() =>
            $"<{nameof(League)} Id=\"{Id}\" StartAt=\"{StartAt}\" EndAt=\"{EndAt}\">";

        public static void OnModelCreating(ModelBuilder modelBuilder) {
            var entity = modelBuilder.Entity<League>();

            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.StartAt);
            entity.HasIndex(e => e.EndAt);
        }
    }
}
