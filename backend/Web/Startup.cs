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
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        // app.UseMiniProfiler();
        app.UseDeveloperExceptionPage();
      }

      app.UseForwardedHeaders(new ForwardedHeadersOptions {
        ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
      });
      app.UseStaticFiles(new StaticFileOptions {
        // Allow serving the .webmanifest file from wwwroot.
        ServeUnknownFileTypes = true,
      });
      app.UseRouting();
      app.UseEndpoints(endpoints => {
        endpoints.MapHub<PoeHub>("/data");
        endpoints.MapRazorPages();
      });

      // Enable CORS.
      app.UseCors(builder => builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod());
    }
  }
}
