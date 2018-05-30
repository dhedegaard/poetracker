﻿using Core;
using Core.Apis;
using Core.Models;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Fetcher {
    class Fetcher {
        internal readonly static string HubConnection = Environment.GetEnvironmentVariable("FETCHER_HUB_CONNECTION_URL") ?? "https://localhost:62613/data";
        internal readonly static int SleepInternal = 1_200;

        private readonly static ILogger logger = new LoggerFactory()
            .AddConsole()
            .CreateLogger<Fetcher>();

        static HubConnection ConnectToTheHub() {
            logger.LogInformation("Connecting to hub: {0}", HubConnection);
            // Connect to the hub.
            var connection = new HubConnectionBuilder()
                .WithUrl(HubConnection)
                .Build();
            connection.StartAsync().Wait();
            return connection;
        }

        static async Task FetchAndUpdateLeagues(PoeContext context) {
            var count = 0;
            foreach (var league in await LeaguesApi.GetMainLeagues()) {
                var leagueObj = context.Leagues
                    .FirstOrDefault(e => e.Id == league.Id) ?? new League();
                var created = leagueObj.Id == null;
                leagueObj.Id = league.Id;
                leagueObj.StartAt = league.StartAt;
                leagueObj.EndAt = league.EndAt;
                leagueObj.Url = league.Url;
                if (created) {
                    context.Add(leagueObj);
                } else {
                    context.Update(leagueObj);
                }
                context.SaveChanges();
                count++;
            }
            logger.LogInformation("Processed {0} leagues", count);
        }

        static async Task FetchUpdateDatapoints(PoeContext context, HubConnection hubConnection) {
            var leagues = context.Leagues
                .Where(e => e.EndAt == null || e.EndAt >= DateTimeOffset.UtcNow)
                .ToList();
            foreach (var account in context.Accounts) {
                logger.LogInformation("Fetching new datapoints for account: {0}", account);
                foreach (var league in leagues) {
                    var characters = await LaddersApi.GetAccountCharacters(league.Id, account.AccountName);

                    // Persist any changes to the backend and notify the hub.
                    if (characters.Any()) {

                        var datapoints = new List<Datapoint>();
                        foreach (var character in characters) {
                            // Find the latest datapoint for the same character, in the same league. If
                            // there's no existing data, the XP has changed or the dead state has changed.
                            // Added a new datapoint.
                            var latestDatapoint = context.Datapoints
                                .Include(e => e.League)
                                .Where(e => e.CharId == character.CharId &&
                                            e.LeagueId == league.Id &&
                                            e.AccountId == account.AccountName)
                                .OrderByDescending(e => e.Timestamp)
                                .FirstOrDefault();

                            if (latestDatapoint == null ||
                                    latestDatapoint.Experience != character.Experience ||
                                    latestDatapoint.Dead != character.Dead ||
                                    latestDatapoint.Online != character.Online) {

                                /* For dead characters, ignore datapoints for never-ending leagues until after the
                                   temporary league for the last datapoint has ended. */
                                if (character.Dead &&
                                    league.EndAt == null &&
                                    latestDatapoint.League.EndAt != null &&
                                    latestDatapoint.League.EndAt < DateTimeOffset.UtcNow) {
                                    continue;
                                }

                                var datapoint = new Datapoint {
                                    CharId = character.CharId,
                                    Account = account,
                                    Charname = character.Name,
                                    Experience = character.Experience,
                                    GlobalRank = character.Rank,
                                    League = league,
                                    Level = character.Level,
                                    Timestamp = DateTimeOffset.Now,
                                    Class = character.Class,
                                    Dead = character.Dead,
                                    Online = character.Online,
                                };
                                datapoints.Add(datapoint);
                                context.Add(datapoint);
                                await context.SaveChangesAsync();
                            }
                        }
                        /* If we created any datapoints, serialize them over the Hub to notify listeners. */
                        if (datapoints.Any()) {
                            logger.LogInformation("NotifyNewData: {0}", datapoints);
                            await hubConnection.InvokeAsync("NotifyNewData", datapoints);
                        }
                    }

                    // Sleep for a bit.
                    Thread.Sleep(SleepInternal);
                }
            }
        }

        static async Task FetchNewDataAsync(PoeContext context, HubConnection connection) {
            // Fetch/update all the leagues.
            await FetchAndUpdateLeagues(context);

            // Fetch/update the datapoints for each account/league combo.
            await FetchUpdateDatapoints(context, connection);
        }

        static void Main(string[] args) {
            // Connect to the hub and create the DB context.
            var hubConnection = ConnectToTheHub();
            using (var context = new PoeContext()) {
                // Do the looping dance.
                for (; ; ) {
                    FetchNewDataAsync(context, hubConnection).Wait();
                }
            }
        }
    }
}
