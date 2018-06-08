using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoint__idx__leagueid_charname_timestamp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Datapoints_LeagueId",
                table: "Datapoints");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_LeagueId_Charname_Timestamp",
                table: "Datapoints",
                columns: new[] { "LeagueId", "Charname", "Timestamp" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Datapoints_LeagueId_Charname_Timestamp",
                table: "Datapoints");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_LeagueId",
                table: "Datapoints",
                column: "LeagueId");
        }
    }
}
