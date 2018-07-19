using System;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;

namespace Web.Tests {
    public class IndexTest : IClassFixture<WebApplicationFactory<StartupTest>> {
        private readonly HttpClient client;

        public IndexTest(WebApplicationFactory<Web.Startup> factory) =>
            client = factory.CreateClient();

        [Fact]
        public async Task TestGet() {
            var resp = await client.GetAsync("/");

            resp.EnsureSuccessStatusCode();
            Assert.Equal("text/html; charset=utf-8", resp.Content.Headers.ContentType.ToString());
        }
    }
}
