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
                    e.CharId == datapoint.CharId &&
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
                  .OrderByDescending(e => e.Id)
                  .GroupBy(e => e.CharId)
                  .ToList()
                  .Select(e => GenerateDatapointResult(e.First())),
                Leagues = poeContext.Leagues
                  .Where(e => e.EndAt == null || e.EndAt >= DateTimeOffset.UtcNow)
                  .OrderByDescending(e => e.StartAt)
                  .ToList(),
            });
        }

        public override Task OnConnectedAsync() {
            SendInitialPayload();
            return base.OnConnectedAsync();
        }

        internal struct GetCharDataResult {
            public string CharId { get; set; }
            public IEnumerable<Datapoint> Datapoints { get; set; }
        }

        public Task GetCharData(string charId) {
            return Clients.Caller.SendAsync("GetCharData", new GetCharDataResult {
                CharId = charId,
                Datapoints = poeContext.Datapoints
                    .Where(e => e.CharId == charId)
                    .OrderBy(e => e.Timestamp),
            });
        }
    }
}
