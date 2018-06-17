using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoint__remove__charid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Datapoints_CharId",
                table: "Datapoints");

            migrationBuilder.DropIndex(
                name: "IX_Datapoints_CharId_Timestamp",
                table: "Datapoints");

            migrationBuilder.DropColumn(
                name: "CharId",
                table: "Datapoints");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CharId",
                table: "Datapoints",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_CharId",
                table: "Datapoints",
                column: "CharId");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_CharId_Timestamp",
                table: "Datapoints",
                columns: new[] { "CharId", "Timestamp" });
        }
    }
}
