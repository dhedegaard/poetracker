using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Core;
using Microsoft.Extensions.DependencyInjection;

namespace Web.Tasks {
  public class FetcherHostedService : IHostedService, IDisposable {
    private Timer timer;
    private bool isRunning = false;
    private readonly IServiceScopeFactory serviceScopeFactory;

    public FetcherHostedService(IServiceScopeFactory serviceScopeFactory) {
      this.serviceScopeFactory = serviceScopeFactory;
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
      .ConfigureWebHostDefaults(builder => {
        builder.UseStartup<Startup>();
      });

    public void Dispose() {
      this.timer?.Dispose();
    }

    public Task StartAsync(CancellationToken cancellationToken) {
      this.timer = new Timer(this.Run, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));
      return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) {
      this.timer?.Dispose();
      this.timer = null;
      return Task.CompletedTask;
    }



    private void Run(object state) {
      if (isRunning) {
        Console.WriteLine("FETCHER ALREADY RUNNIGN!");
        return;
      }
      Console.WriteLine("RUNNING FETCHER SERVICE!");
      isRunning = true;
      using (var scope = serviceScopeFactory.CreateScope()) {
        var context = scope.ServiceProvider.GetService<PoeContext>();
        Fetcher.Fetcher.Run(context).Wait();
      }
      isRunning = false;
      Console.WriteLine("DONE RUNNING FETCHER!");
    }
  }
}