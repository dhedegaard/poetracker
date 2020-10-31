using Core;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.ViewModels {
  public class InitialPayload {
    public IEnumerable<League> Leagues { get; set; }
    public IEnumerable<DatapointResult> Datapoints { get; set; }
    public IEnumerable<Account> Accounts { get; set; }

    public static async Task<InitialPayload> BuildInitialPayload(PoeContext poeContext) {
      // Implement as LINQ later, when EFCore/Npgsql supports proper groupby's.
      var validLeagueIds = await poeContext.Leagues
          .Where(l => l.EndAt == null || l.EndAt >= DateTime.Now)
          .Select(l => l.Id)
          .ToListAsync();

      var datapoints = await poeContext.Datapoints
            .FromSqlRaw(@"
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
            .FromSqlRaw(@"
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
        Datapoints = datapoints
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
  }
}
