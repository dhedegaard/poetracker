using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class account__twitchusername : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "bravoscript");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "johnconor");

            migrationBuilder.AddColumn<string>(
                name: "TwitchUsername",
                table: "Accounts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TwitchUsername",
                table: "Accounts");

            migrationBuilder.InsertData(
                table: "Accounts",
                column: "AccountName",
                value: "johnconor");

            migrationBuilder.InsertData(
                table: "Accounts",
                column: "AccountName",
                value: "bravoscript");
        }
    }
}
