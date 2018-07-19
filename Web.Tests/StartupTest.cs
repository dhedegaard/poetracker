using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Web.Tests {
    public class StartupTest : Startup {
        public StartupTest(IConfiguration configuration, IHostingEnvironment env) : base(configuration, env) {
            env.EnvironmentName = "Testing";
        }
    }
}