using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace Core.Apis {
    public static class LaddersApi {
        class Result {
            public IEnumerable<InternalEntry> Entries { get; set; }
        }

        class InternalEntry {
            public int Rank { get; set; }
            public bool Dead { get; set; }
            public bool Online { get; set; }
            public InternalCharacter Character { get; set; }

            public override string ToString() =>
                $"<{nameof(InternalEntry)} rank={Rank} dead={Dead} online={Online} character={Character}>";
        }

        class InternalCharacter {
            public int Level { get; set; }
            public string Name { get; set; }
            public string Class { get; set; }
            public string Id { get; set; }
            public long Experience { get; set; }

            public override string ToString() =>
                $"<{nameof(InternalCharacter)} name=\"{Name}\" level={Level} class=\"{Class}\">";
        }

        public class Character {
            public string CharId { get; set; }
            public string Name { get; set; }
            public string Class { get; set; }
            public int Rank { get; set; }
            public int Level { get; set; }
            public long Experience { get; set; }
            public bool Dead { get; set; }
            public bool Online { get; set; }

            public override string ToString() =>
                $"<{nameof(Character)} name=\"{Name}\" class=\"{Class}\" rank={Rank} level={Level} exp={Experience} dead={Dead} online={Online}>";
        }

        public async static Task<IEnumerable<Character>> GetAccountCharacters(string ladderId, string accountName) {
            using (var client = new WebClient()) {
                var data = await client.DownloadStringTaskAsync(new Uri(
                    $"https://www.pathofexile.com/api/ladders?id={HttpUtility.UrlEncode(ladderId)}&type=league&accountName={accountName}"
                ));
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
}

