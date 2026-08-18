using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class AppointmentConfig : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasIndex(x => new { x.DoctorId, x.Date, x.Hour });
        builder.HasIndex(x => new { x.UserId, x.Status });
        builder.HasIndex(x => x.Date);
    }
}
