﻿using Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Web.Hubs;

namespace Web {
    public class Startup {
        public Startup(IConfiguration configuration) =>
            Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc();
            services.AddSignalR();
            services.AddDbContext<PoeContext>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            app.Use(async (context, next) => {


                await next.Invoke();
            });
            app.UseStaticFiles();
            app.UseMvc();
            app.UseSignalR(routes =>
                routes.MapHub<PoeHub>("/data"));
        }
    }
}
