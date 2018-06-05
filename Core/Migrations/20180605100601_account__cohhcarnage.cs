using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class account__cohhcarnage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "AccountName", "TwitchUsername" },
                values: new object[] { "cohhcarnage", "cohhcarnage" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "cohhcarnage");
        }
    }
}
