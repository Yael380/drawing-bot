using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bot_server.Migrations
{
    /// <inheritdoc />
    public partial class SomeNewMigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Radius",
                table: "Drawings",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Radius",
                table: "Drawings");
        }
    }
}
