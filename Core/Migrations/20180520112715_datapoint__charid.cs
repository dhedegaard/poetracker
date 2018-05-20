using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoint__charid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Datapoints_Charname_Timestamp",
                table: "Datapoints");

            migrationBuilder.AddColumn<string>(
                name: "CharId",
                table: "Datapoints",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_CharId",
                table: "Datapoints",
                column: "CharId");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_CharId_Timestamp",
                table: "Datapoints",
                columns: new[] { "CharId", "Timestamp" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_Charname_Timestamp",
                table: "Datapoints",
                columns: new[] { "Charname", "Timestamp" });
        }
    }
}
