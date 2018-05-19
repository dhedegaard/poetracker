using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Core.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountName);
                });

            migrationBuilder.CreateTable(
                name: "Leagues",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    StartAt = table.Column<DateTimeOffset>(nullable: false),
                    EndAt = table.Column<DateTimeOffset>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leagues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Datapoints",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Timestamp = table.Column<DateTimeOffset>(nullable: false),
                    Charname = table.Column<string>(nullable: false),
                    GlobalRank = table.Column<int>(nullable: false),
                    Experience = table.Column<int>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    LeagueId = table.Column<string>(nullable: false),
                    AccountId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Datapoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Datapoints_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountName",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Datapoints_Leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "Leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_AccountId",
                table: "Datapoints",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_LeagueId",
                table: "Datapoints",
                column: "LeagueId");

            migrationBuilder.CreateIndex(
                name: "IX_Datapoints_Charname_Timestamp",
                table: "Datapoints",
                columns: new[] { "Charname", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_Leagues_EndAt",
                table: "Leagues",
                column: "EndAt");

            migrationBuilder.CreateIndex(
                name: "IX_Leagues_StartAt",
                table: "Leagues",
                column: "StartAt");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Datapoints");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Leagues");
        }
    }
}
