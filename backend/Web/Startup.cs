using Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Web.Hubs;
using Web.Tasks;

namespace Web {
  public class Startup {
    private readonly IConfiguration configuration;
    private readonly IWebHostEnvironment env;

    public Startup(IConfiguration configuration, IWebHostEnvironment env) {
      this.configuration = configuration;
      this.env = env;
    }

    public void ConfigureServices(IServiceCollection services) {
      services.AddMvc();
      services.AddSignalR(options => {
        options.EnableDetailedErrors = this.env.IsDevelopment();
        options.MaximumReceiveMessageSize = null;
      });
      services.AddDbContext<PoeContext>();
      services.AddMemoryCache();
      services.AddHostedService<InitialPayloadTimedHostedService>();
      if (this.env.IsDevelopment()) {
        services.AddMiniProfiler()
                .AddEntityFramework();
      }
      services.AddHostedService<FetcherHostedService>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
      }

      // Enable CORS.
      app.UseCors(builder => builder.WithOrigins("http://localhost:3000", "https://poe.culan.dk", "https://poe-beta.culan.dk").AllowAnyHeader().AllowAnyMethod().AllowCredentials());
      app.UseForwardedHeaders(new ForwardedHeadersOptions {
        ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
      });
      app.UseRouting();

      // Handle routes.
      app.UseEndpoints(endpoints => {
        endpoints.MapHub<PoeHub>("/data");
      });

    }
  }
}
