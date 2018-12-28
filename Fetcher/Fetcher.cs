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
                .Where(e => e.EndAt == null || e.EndAt >= DateTime.Now)
                .ToList();
            foreach (var account in context.Accounts) {
                var windowCharacters = await CharactersApi.GetCharacters(account.AccountName);
                logger.LogInformation("Fetching new datapoints for account: {0}", account);
                foreach (var league in leagues) {
                    var characters = await LaddersApi.GetAccountCharacters(league.Id, account.AccountName);
                    var datapoints = new List<Datapoint>();
                    var datapointCharnames = new HashSet<string>();
                    if (characters.Any()) {
                        foreach (var character in characters) {

                            // If there are no characters with that name in
                            // the current league, based on the character
                            // window data, skip it.
                            // Unless the character is dead, in which case the
                            // character no longer exists in the league but
                            // should still keep the stop as "dead".
                            if (!character.Dead && !windowCharacters.Any(c =>
                                    c.Name == character.Name &&
                                    c.League == league.Id)) {
                                continue;
                            }

                            // Find the latest datapoint for the same character, in the same league. If
                            // there's no existing data, the XP has changed or the dead state has changed.
                            // Added a new datapoint.
                            var latestDatapoint = context.Datapoints
                                .Include(e => e.League)
                                .Where(e => e.Charname == character.Name &&
                                            e.LeagueId == league.Id &&
                                            e.AccountId == account.AccountName)
                                .OrderByDescending(e => e.Timestamp)
                                .FirstOrDefault();

                            if (latestDatapoint == null ||
                                    latestDatapoint.Experience != character.Experience ||
                                    latestDatapoint.GlobalRank != character.Rank ||
                                    latestDatapoint.Dead != character.Dead ||
                                    latestDatapoint.Online != character.Online) {

                                var datapoint = new Datapoint {
                                    Account = account,
                                    Charname = character.Name,
                                    Experience = character.Experience,
                                    GlobalRank = character.Rank,
                                    League = league,
                                    Level = character.Level,
                                    Timestamp = DateTime.Now,
                                    Class = character.Class,
                                    Dead = character.Dead,
                                    Online = character.Online,
                                };
                                datapoints.Add(datapoint);
                                datapointCharnames.Add(datapoint.Charname);
                                context.Add(datapoint);
                                await context.SaveChangesAsync();
                            }
                            /* If there's a datapoint, avoid registering datapoints based on window data. */
                            if (latestDatapoint != null) {
                                datapointCharnames.Add(character.Name);
                            }
                        }
                    }

                    // Go looking for datapoints that should be created, for characters out of the league.
                    foreach (var windowChar in windowCharacters
                            .Where(e => e.League == league.Id && !datapointCharnames.Contains(e.Name))) {

                        // Otherwise, proceed more or less as above.
                        var latestDatapoint = context.Datapoints
                            .Include(e => e.League)
                            .Where(e => e.Charname == windowChar.Name &&
                                        e.LeagueId == league.Id &&
                                        e.AccountId == account.AccountName)
                            .OrderByDescending(e => e.Timestamp)
                            .FirstOrDefault();

                        if (latestDatapoint == null ||
                                latestDatapoint.Experience != windowChar.Experience ||
                                (DateTime.Now - latestDatapoint.Timestamp).Days >= 1) {

                            var datapoint = new Datapoint {
                                Account = account,
                                Charname = windowChar.Name,
                                Experience = windowChar.Experience,
                                GlobalRank = null,
                                League = league,
                                Level = windowChar.Level,
                                Timestamp = DateTime.Now,
                                Class = windowChar.Class,
                                Dead = false,
                                Online = null,
                            };
                            datapoints.Add(datapoint);
                            datapointCharnames.Add(datapoint.Charname);
                            context.Add(datapoint);
                            await context.SaveChangesAsync();
                        }

                    }
                    /* If we created any datapoints, serialize them over the Hub to notify listeners. */
                    if (datapoints.Any()) {
                        logger.LogInformation("NotifyNewData: {0}", datapoints);
                        await hubConnection.InvokeAsync("NotifyNewData", datapoints);
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
