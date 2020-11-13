using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

BuildWebHost(args).Run();

static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseStartup<Web.Startup>();
static IWebHost BuildWebHost(string[] args) =>
    CreateWebHostBuilder(args).Build();
