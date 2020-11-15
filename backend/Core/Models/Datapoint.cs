using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models {
  public record Datapoint {
    [Key]
    public int? Id { get; set; }
    [Required]
    public DateTimeOffset Timestamp { get; set; }
    [Required]
    public string Charname { get; set; }
    public int? GlobalRank { get; set; }
    [Required]
    public decimal Experience { get; set; }
    [Required]
    public int Level { get; set; }
    [Required]
    public string Class { get; set; }
    public bool? Online { get; set; }
    [Required]
    public bool Dead { get; set; }

    [Required]
    public League League { get; set; }
    public string LeagueId { get; set; }

    [Required]
    public Account Account { get; set; }
    public string AccountId { get; set; }

    public string PoeProfileURL {
      get => $"http://poe-profile.info/profile/{AccountId}/{Charname}";
    }

    public override string ToString() =>
            $"<{nameof(Datapoint)} id={Id}, timestamp={Timestamp}, charname={Charname}>";

    public static void OnModelCreating(ModelBuilder modelBuilder) {
      var entity = modelBuilder.Entity<Datapoint>();

      entity.HasKey(e => e.Id);
      // For fetching all the datapoints, for a given char in a given league.
      entity.HasIndex(e => new { e.LeagueId, e.Charname, e.Timestamp });
      // For the initial payload.
      entity.HasIndex(e => new { e.Timestamp, e.LeagueId, e.Id });
    }
  }
}
