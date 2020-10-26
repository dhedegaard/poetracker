using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class account_seeddata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Accounts",
                column: "AccountName",
                value: "johnconor");

            migrationBuilder.InsertData(
                table: "Accounts",
                column: "AccountName",
                value: "bravoscript");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "bravoscript");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "johnconor");
        }
    }
}
