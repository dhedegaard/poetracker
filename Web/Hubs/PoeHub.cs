using Core;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Web.ViewModels;
using System;

namespace Web.Hubs {
    public class PoeHub : Hub {
        private readonly PoeContext poeContext;

        public PoeHub(PoeContext poeContext) {
            this.poeContext = poeContext;
        }

        public async Task NotifyNewData(IEnumerable<Datapoint> characters) {
            await Clients.All.SendAsync("NotifyNewData", characters
                .Select(e => GenerateDatapointResult(e)));
        }

        /// <summary>
        /// Takes a datapoint and translates it to a DatapointResult, by querying the backend for extra data (in this case an older datapoint).
        /// Rather slow, avoid using in 1+N conditions and such.
        /// </summary>
        internal DatapointResult GenerateDatapointResult(Datapoint datapoint) {
            // Change as appropriate.
            var dateBreakpoint = DateTime.Now - TimeSpan.FromHours(6);

            var previousDatapoint = poeContext.Datapoints
                .OrderByDescending(e => e.Id)
                .Where(e =>
                    e.LeagueId == datapoint.LeagueId &&
                    e.Charname == datapoint.Charname &&
                    e.Timestamp <= dateBreakpoint)
                .FirstOrDefault();

            // If the previous datapoint is the same as the current datapoint (ie the current datapoint if before the dataBreakpoint), set the previous datapoint to null.
            if (previousDatapoint != null && previousDatapoint.Id == datapoint.Id) {
                previousDatapoint = null;
            }

            return new DatapointResult {
                Datapoint = datapoint,
                PreviousDatapoint = previousDatapoint,
            };
        }

        public static async Task<InitialPayload> BuildInitialPayload(PoeContext poeContext) {
            // Implement as LINQ later, when EFCore/Npgsql supports proper groupby's.
            var validLeagueIds = await poeContext.Leagues
                .Where(l => l.EndAt == null || l.EndAt >= DateTime.Now)
                .Select(l => l.Id)
                .ToListAsync();

            var datapoints = await poeContext.Datapoints
                  .FromSql(@"
                    SELECT d.*
                    FROM ""Datapoints"" d
                    INNER JOIN (
                      SELECT MAX(d.""Id"") AS id
                      FROM ""Datapoints"" d
                      WHERE d.""LeagueId"" = ANY({0})
                      GROUP BY d.""Charname"", d.""LeagueId""
                    ) AS q on q.id = d.""Id""",
                    validLeagueIds)
                  .Include(e => e.League)
                  .Include(e => e.Account)
                  .ToListAsync();
            var previousDatapoints = await poeContext.Datapoints
                  .FromSql(@"
                    SELECT d.*
                    FROM ""Datapoints"" d
                      INNER JOIN (
                        SELECT MAX(d.""Id"") as id
                        FROM ""Datapoints"" d
                        WHERE d.""LeagueId"" = ANY({0})
                            AND d.""Timestamp"" <= NOW() - INTERVAL '6 hours'
                            AND NOT (d.""Id"" = ANY({1}))
                        GROUP BY d.""Charname"", d.""LeagueId""
                      ) AS q ON d.""Id"" = q.id",
                    validLeagueIds,
                    datapoints.Select(e => e.Id.Value).ToList()
                  )
                  .ToListAsync();
            return new InitialPayload {
                LatestDatapoints = datapoints
                    .Select(datapoint => new DatapointResult {
                        Datapoint = datapoint,
                        PreviousDatapoint = previousDatapoints
                            .Where(e =>
                                e.LeagueId == datapoint.LeagueId &&
                                e.Charname == datapoint.Charname)
                            .FirstOrDefault(),
                    }),
                Leagues = await poeContext.Leagues
                  .Where(e => e.EndAt == null || e.EndAt >= DateTime.Now)
                  .OrderByDescending(e => e.StartAt)
                  .ToListAsync(),
                Accounts = await poeContext.Accounts
                  .OrderByDescending(e => e.TwitchUsername ?? e.AccountName)
                  .ToListAsync(),
            };
        }

        internal void SendInitialPayload() {
            Clients.Caller.SendAsync("InitialPayload", BuildInitialPayload(poeContext).Result);
        }

        public override Task OnConnectedAsync() {
            SendInitialPayload();
            return base.OnConnectedAsync();
        }

        internal struct GetCharDataResult {
            public string LeagueId { get; set; }
            public string Charname { get; set; }
            public IEnumerable<Datapoint> Datapoints { get; set; }
        }

        public Task GetCharData(string leagueId, string charname) {
            return Clients.Caller.SendAsync("GetCharData", new GetCharDataResult {
                LeagueId = leagueId,
                Charname = charname,
                Datapoints = poeContext.Datapoints
                    .Where(e =>
                        e.LeagueId == leagueId &&
                        e.Charname == charname)
                    .OrderBy(e => e.Timestamp),
            });
        }
    }
}
