using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoint__online__optional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Online",
                table: "Datapoints",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<int>(
                name: "GlobalRank",
                table: "Datapoints",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "CharId",
                table: "Datapoints",
                nullable: true,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Online",
                table: "Datapoints",
                nullable: false,
                oldClrType: typeof(bool),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GlobalRank",
                table: "Datapoints",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CharId",
                table: "Datapoints",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
