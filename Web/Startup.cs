using Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Web.Hubs;

namespace Web {
    public class Startup {
        private IConfiguration configuration;
        private readonly IHostingEnvironment env;

        public Startup(IConfiguration configuration, IHostingEnvironment env) {
            this.configuration = configuration;
            this.env = env;
        }

        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc();
            services.AddSignalR();
            services.AddDbContext<PoeContext>();
            services.AddMemoryCache();
            if (this.env.IsDevelopment()) {
                services.AddMiniProfiler()
                        .AddEntityFramework();
            }
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseMiniProfiler();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
            });
            app.UseStaticFiles(new StaticFileOptions {
                // Allow serving the .webmanifest file from wwwroot.
                ServeUnknownFileTypes = true,
            });
            app.UseMvc();
            app.UseSignalR(routes =>
                routes.MapHub<PoeHub>("/data"));
        }
    }
}
