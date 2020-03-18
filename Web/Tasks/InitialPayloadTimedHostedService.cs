using System;
using System.Threading;
using System.Threading.Tasks;
using Core;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Web.ViewModels;

namespace Web.Tasks {
  public class InitialPayloadTimedHostedService : IHostedService, IDisposable {
    private Timer timer;
    private readonly IMemoryCache cache;
    private readonly IServiceScopeFactory scopeFactory;

    public InitialPayloadTimedHostedService(IMemoryCache cache, IServiceScopeFactory scopeFactory) {
      this.cache = cache;
      this.scopeFactory = scopeFactory;
    }

    public void Dispose() {
      this.timer?.Dispose();
      this.timer = null;
    }

    public Task StartAsync(CancellationToken cancellationToken) {
      this.timer = new Timer(this.Run, null, TimeSpan.Zero, TimeSpan.FromMinutes(2));
      return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) {
      this.timer?.Dispose();
      this.timer = null;
      return Task.CompletedTask;
    }

    private void Run(object state) {
      this.BuildAndSavePayload();
    }

    private async void BuildAndSavePayload() {
      using (var scope = this.scopeFactory.CreateScope()) {
        var context = scope.ServiceProvider.GetRequiredService<PoeContext>();
        var payload = await InitialPayload.BuildInitialPayload(context);
        Console.WriteLine("BuildAndSavePayload completed");
        this.cache.Set("initialPayload", payload);
      }
    }
  }
}