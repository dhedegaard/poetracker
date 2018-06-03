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
        /// </summary>
        internal DatapointResult GenerateDatapointResult(Datapoint datapoint) {
            // Change as appropriate.
            var dateBreakpoint = DateTimeOffset.Now - TimeSpan.FromHours(6);

            var previousDatapoint = poeContext.Datapoints
                .Include(e => e.Account)
                .Include(e => e.League)
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

        internal void SendInitialPayload() {
            Clients.Caller.SendAsync("InitialPayload", new InitialPayload {
                LatestDatapoints = poeContext.Datapoints
                  .Include(e => e.Account)
                  .Include(e => e.League)
                  .Where(e => e.League.EndAt == null || e.League.EndAt >= DateTimeOffset.UtcNow)
                  .OrderByDescending(e => e.Id)
                  .GroupBy(e => new { e.Charname, e.LeagueId })
                  .ToList()
                  .Select(e => GenerateDatapointResult(e.First())),
                Leagues = poeContext.Leagues
                  .Where(e => e.EndAt == null || e.EndAt >= DateTimeOffset.UtcNow)
                  .OrderByDescending(e => e.StartAt)
                  .ToList(),
                Accounts = poeContext.Accounts
                  .OrderByDescending(e => string.IsNullOrWhiteSpace(e.TwitchUsername))
                  .ThenBy(e => e.AccountName),
            });
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
