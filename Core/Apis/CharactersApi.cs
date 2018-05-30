using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Core.Apis {
    public class WindowCharacter {
        public string Name { get; set; }
        public string League { get; set; }
        public int ClassId { get; set; }
        public int AscendancyClass { get; set; }
        public string Class { get; set; }
        public int Level { get; set; }
        public long Experience { get; set; }
    }
    public static class CharactersApi {
        public async static Task<IList<WindowCharacter>> GetCharacters(string accountName) {
            using (var client = new WebClient()) {
                var data = await client.DownloadStringTaskAsync(new Uri(
                    $"https://www.pathofexile.com/character-window/get-characters?accountName={accountName}"
                ));
                return JsonConvert.DeserializeObject<IList<WindowCharacter>>(data);
            }
        }
    }
}