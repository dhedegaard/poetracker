using Core;
using Web.Models;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.Models;

namespace Web.Hubs {
    public class PoeHub : Hub {
        private readonly PoeContext poeContext;

        public PoeHub(PoeContext poeContext) {
            this.poeContext = poeContext;
        }

        public async Task NotifyNewData(IList<Datapoint> characters) {
            await Clients.All.SendAsync("NotifyNewData", characters);
        }

        internal void SendInitialPayload() {
            Clients.Caller.SendAsync("InitialPayload", new InitialPayload {
                LatestDatapoints = poeContext.Datapoints
                    .OrderByDescending(e => e.Id)
                    .GroupBy(e => e.Charname)
                    .Select(e => e.First())
                    .ToList(),
                Leagues = poeContext.Leagues
                    .OrderByDescending(e => e.StartAt)
                    .ToList(),
            });
        }

        public override Task OnConnectedAsync() {
            SendInitialPayload();
            return base.OnConnectedAsync();
        }
    }
}
