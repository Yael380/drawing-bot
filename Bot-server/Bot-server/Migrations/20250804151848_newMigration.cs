using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bot_server.Migrations
{
    /// <inheritdoc />
    public partial class newMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "x2",
                table: "Drawings",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "y2",
                table: "Drawings",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "x2",
                table: "Drawings");

            migrationBuilder.DropColumn(
                name: "y2",
                table: "Drawings");
        }
    }
}
