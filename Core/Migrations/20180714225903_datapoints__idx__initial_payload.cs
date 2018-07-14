using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoints__idx__initial_payload : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_Timestamp_LeagueId_Id",
                table: "Datapoints",
                columns: new[] { "Timestamp", "LeagueId", "Id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Datapoints_Timestamp_LeagueId_Id",
                table: "Datapoints");
        }
    }
}
