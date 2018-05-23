using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class account__better_seed_data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "AccountName", "TwitchUsername" },
                values: new object[,]
                {
                    { "nugiyen", "nugiyen" },
                    { "helman", "Helman" },
                    { "raizqt", "RaizQT" },
                    { "dclara", "DCLara1" },
                    { "havoc6", "havoc616" },
                    { "alkaizerx", "alkaizerx" },
                    { "pinytenis", "Bakedchicken" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "alkaizerx");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "dclara");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "havoc6");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "helman");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "nugiyen");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "pinytenis");

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "AccountName",
                keyValue: "raizqt");
        }
    }
}
