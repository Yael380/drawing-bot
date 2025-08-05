using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bot_server.Migrations
{
    /// <inheritdoc />
    public partial class AddRadiusToDrawing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Radius",
                table: "Drawings",
                nullable: true); // או false אם לא nullable
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Radius",
                table: "Drawings");
        }


    }
}
