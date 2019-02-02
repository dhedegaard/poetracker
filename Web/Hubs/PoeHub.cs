using Core;
using Core.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.ViewModels;

namespace Web.Hubs {
  public class PoeHub : Hub {
    private readonly PoeContext poeContext;
    private readonly IMemoryCache cache;
    private readonly IJsonHelper jsonHelper;

    public PoeHub(PoeContext poeContext, IMemoryCache cache, IJsonHelper jsonHelper) {
      this.poeContext = poeContext;
      this.cache = cache;
      this.jsonHelper = jsonHelper;
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

    internal void SendInitialPayload() {
      var initialPayload = InitialPayload.BuildInitialPayload(poeContext).Result;
      Clients.Caller.SendAsync("InitialPayload", initialPayload);
      cache.Set("initialPayload", this.jsonHelper.Serialize(initialPayload));
    }

    public override Task OnConnectedAsync() {
      SendInitialPayload();
      return base.OnConnectedAsync();
    }

    internal struct GetCharDataResult {
      public string LeagueId { get; set; }
      public string Charname { get; set; }
      public IEnumerable<Datapoint> Result { get; set; }
    }

    public Task GetCharData(string leagueId, string charname) {
      return Clients.Caller.SendAsync("GetCharData", new GetCharDataResult {
        LeagueId = leagueId,
        Charname = charname,
        Result = poeContext.Datapoints
              .Where(e =>
                  e.LeagueId == leagueId &&
                  e.Charname == charname)
              .OrderBy(e => e.Timestamp),
      });
    }
  }
}
