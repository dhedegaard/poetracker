using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class datapoint__experience__int_to_long : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "Experience",
                table: "Datapoints",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Experience",
                table: "Datapoints",
                nullable: false,
                oldClrType: typeof(long));
        }
    }
}
