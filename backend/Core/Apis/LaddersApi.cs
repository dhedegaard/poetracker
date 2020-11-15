using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace Core.Apis {
  public static class LaddersApi {
    record Result {
      public IEnumerable<InternalEntry> Entries;
    }

    record InternalEntry {
      public int Rank;
      public bool Dead;
      public bool Online;
      public InternalCharacter Character;
    }

    record InternalCharacter {
      public string Id;
      public int Level;
      public string Name;
      public string Class;
      public long Experience;
    }

    public record Character {
      public string CharId;
      public string Name;
      public string Class;
      public int Rank;
      public int Level;
      public long Experience;
      public bool Dead;
      public bool Online;
    }

    public async static Task<IEnumerable<Character>> GetAccountCharacters(string ladderId, string accountName) {
      var url = $"https://www.pathofexile.com/api/ladders?id={HttpUtility.UrlEncode(ladderId)}&type=league&accountName={accountName}";
      using var client = new WebClient();
      var data = await client.DownloadStringTaskAsync(new Uri(url));
      return JsonConvert.DeserializeObject<Result>(data).Entries
          .Select(res => new Character {
            CharId = res.Character.Id,
            Name = res.Character.Name,
            Class = res.Character.Class,
            Rank = res.Rank,
            Level = res.Character.Level,
            Experience = res.Character.Experience,
            Dead = res.Dead,
            Online = res.Online,
          });

    }
  }
}

