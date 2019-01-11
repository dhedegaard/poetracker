# Poetracker

[![Build Status](https://travis-ci.org/dhedegaard/poetracker.svg?branch=master)](https://travis-ci.org/dhedegaard/poetracker)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3d78afbdef7f44669e34d79a2483a9eb)](https://www.codacy.com/app/dhedegaard/poetracker?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dhedegaard/poetracker&amp;utm_campaign=Badge_Grade)
[![Build Status](https://dev.azure.com/dhedegaard/personlig/_apis/build/status/dhedegaard.poetracker?branchName=master)](https://dev.azure.com/dhedegaard/personlig/_build/latest?definitionId=2?branchName=master) [![Greenkeeper badge](https://badges.greenkeeper.io/dhedegaard/poetracker.svg)](https://greenkeeper.io/)

A simple app for tracking the ranks of friends and such in [Path of Exile](https://www.pathofexile.com).

The basic idea is:

- A web interface, where clients connect and get data over [SignalR core](https://github.com/aspnet/SignalR), written using [Typescript](http://www.typescriptlang.org/) and [React](https://reactjs.org/).
- An ASP.NET core app, running a SignalR core hub.
- A small fetcher application that stores any new data and submits it to the hub.

The application uses SignalR core, and therefore requires [ASP.NET core](https://github.com/aspnet/Home) 2.1+.

## How to run it

- Download the source code, either through git or as a zip/tarball.
- Make sure you have a postgres running, with a `poetracker` database and user.
- Migrate the tables and such from the Core directory: `$ dotnet ef database update`
- Install frontend dependencies and build the bundles (required NodeJS), from the Web directory: `$ npm i && npm start`
- Run the ASP.NET application from the Web directory: `$ dotnet run`
- Run the fetcher application from the Fetcher directory: `$ dotnet run`

Or the easy way: `$ docker-compose up --build`

## How to help

Feel free to send pull requests, feature requests and create issues when you hit bugs :)
