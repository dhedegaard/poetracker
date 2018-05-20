﻿// <auto-generated />
using System;
using Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Core.Migrations
{
    [DbContext(typeof(PoeContext))]
    [Migration("20180520104406_datapoint__experience__int_to_long")]
    partial class datapoint__experience__int_to_long
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.1.0-rc1-32029")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Core.Models.Account", b =>
                {
                    b.Property<string>("AccountName")
                        .ValueGeneratedOnAdd();

                    b.HasKey("AccountName");

                    b.ToTable("Accounts");

                    b.HasData(
                        new { AccountName = "johnconor" },
                        new { AccountName = "bravoscript" }
                    );
                });

            modelBuilder.Entity("Core.Models.Datapoint", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AccountId")
                        .IsRequired();

                    b.Property<string>("Charname")
                        .IsRequired();

                    b.Property<string>("Class")
                        .IsRequired();

                    b.Property<bool>("Dead");

                    b.Property<long>("Experience");

                    b.Property<int>("GlobalRank");

                    b.Property<string>("LeagueId")
                        .IsRequired();

                    b.Property<int>("Level");

                    b.Property<bool>("Online");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.HasKey("Id");

                    b.HasIndex("AccountId");

                    b.HasIndex("LeagueId");

                    b.HasIndex("Charname", "Timestamp");

                    b.ToTable("Datapoints");
                });

            modelBuilder.Entity("Core.Models.League", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset?>("EndAt");

                    b.Property<DateTimeOffset>("StartAt");

                    b.Property<string>("Url");

                    b.HasKey("Id");

                    b.HasIndex("EndAt");

                    b.HasIndex("StartAt");

                    b.ToTable("Leagues");
                });

            modelBuilder.Entity("Core.Models.Datapoint", b =>
                {
                    b.HasOne("Core.Models.Account", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Core.Models.League", "League")
                        .WithMany()
                        .HasForeignKey("LeagueId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
