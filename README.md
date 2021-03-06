# Poetracker

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3d78afbdef7f44669e34d79a2483a9eb)](https://www.codacy.com/app/dhedegaard/poetracker?utm_source=github.com&utm_medium=referral&utm_content=dhedegaard/poetracker&utm_campaign=Badge_Grade)
[![Node.js CI](https://github.com/dhedegaard/poetracker/workflows/Node.js%20CI/badge.svg)](https://github.com/dhedegaard/poetracker/actions?query=workflow%3A%22Node.js+CI%22)
[![.NET Core](https://github.com/dhedegaard/poetracker/workflows/.NET%20Core/badge.svg)](https://github.com/dhedegaard/poetracker/actions?query=workflow%3A%22.NET+Core%22)

A simple app for tracking the ranks of friends and such in [Path of Exile](https://www.pathofexile.com).

The basic idea is:

- A web interface, where clients connect and get data over [SignalR core](https://github.com/aspnet/SignalR), written using [Typescript](http://www.typescriptlang.org/) and [React](https://reactjs.org/).
- An ASP.NET core app, running a SignalR core hub.
- A small fetcher application that stores any new data and submits it to the hub.

The application uses SignalR core, and therefore requires [ASP.NET core](https://github.com/aspnet/Home) 5.0+.

## How to run it

- Download the source code, either through git or as a zip/tarball.
- Make sure you have a postgres running, with a `poetracker` database and user.
- Migrate the tables and such from the Core directory: `$ dotnet ef database update`
- Install frontend dependencies and build the bundles (required NodeJS), from the Web directory: `$ yarn && yarn start`
- Run the ASP.NET application from the backend/Web directory: `$ dotnet run`

Or the easy way: `$ docker-compose up --build`

## How to help

Feel free to send pull requests, feature requests and create issues when you hit bugs :)

## Weird character data on wrong accounts

This happens when the Path of Exile API return some bad data.

The easiest way to fix your data is to delete all the datapoints for charname/account/league that only has a single row. An example of how this can be achieved via psql is:

```sql
delete from "Datapoints"
where "Id" in (
  select min("Id") as "Id"
  from "Datapoints"
  group by "Charname", "AccountId", "LeagueId"
  having count(*) < 2
)
```
