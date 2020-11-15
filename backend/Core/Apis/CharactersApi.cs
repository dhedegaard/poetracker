using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Core.Apis {
  public record WindowCharacter {
    public string Name;
    public string League;
    public int ClassId;
    public int AscendancyClass;
    public string Class;
    public int Level;
    public long Experience;
    public bool? LastActive;
  }

  public class AccountNotPublicException : Exception { }

  public static class CharactersApi {
    public async static Task<IList<WindowCharacter>> GetCharacters(string accountName) {
      try {
        using (var client = new WebClient()) {
          var data = await client.DownloadStringTaskAsync(new Uri(
              $"https://www.pathofexile.com/character-window/get-characters?accountName={accountName}"
          ));
          return JsonConvert.DeserializeObject<IList<WindowCharacter>>(data);
        }
      } catch (WebException e) {
        if (e.Status == WebExceptionStatus.ProtocolError) {
          var resp = (HttpWebResponse)e.Response;
          // 404: Fobidden means the account does not allow indexing.
          if (resp.StatusCode == HttpStatusCode.Forbidden) {
            throw new AccountNotPublicException();
          }
        }
        throw;
      }
    }
  }
}