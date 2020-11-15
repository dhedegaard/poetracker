using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Core.Apis {
  public static class LeaguesApi {
    public record LeagueType {
      [Column("id")]
      public string Id;
      [Column("url")]
      public string Url;
      [Column("startAt")]
      public DateTimeOffset StartAt;
      [Column("endAt")]
      public DateTimeOffset? EndAt;

      public override string ToString() =>
          $"<{nameof(LeagueType)} Id=\"{Id}\" StartAt=\"{StartAt}\" EndAt=\"{EndAt}\">";
    }

    public async static Task<IEnumerable<LeagueType>> GetMainLeagues() {
      var now = DateTime.UtcNow;
      using (var client = new WebClient()) {
        var data = await client.DownloadStringTaskAsync(new Uri("https://www.pathofexile.com/api/leagues?type=main"));
        // Deserialize and filter away inactive leagues.
        return JsonConvert.DeserializeObject<IEnumerable<LeagueType>>(data)
            .Where(e => e.StartAt < now && (e.EndAt == null || e.EndAt > now));
      }
    }
  }
}
