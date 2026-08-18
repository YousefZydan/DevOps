using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_Date",
                table: "Appointments",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId_Date_Hour",
                table: "Appointments",
                columns: new[] { "DoctorId", "Date", "Hour" });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_UserId_Status",
                table: "Appointments",
                columns: new[] { "UserId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_Date",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_DoctorId_Date_Hour",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_UserId_Status",
                table: "Appointments");
        }
    }
}
