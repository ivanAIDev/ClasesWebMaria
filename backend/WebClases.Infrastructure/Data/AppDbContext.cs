using Microsoft.EntityFrameworkCore;
using WebClases.Domain.Entities;

namespace WebClases.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<TeacherProfile> TeacherProfiles => Set<TeacherProfile>();
    public DbSet<Availability> Availabilities => Set<Availability>();
    public DbSet<LessonType> LessonTypes => Set<LessonType>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(u => u.LastName).HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(256).IsRequired();
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Phone).HasMaxLength(20);
        });

        // TeacherProfile
        modelBuilder.Entity<TeacherProfile>(entity =>
        {
            entity.Property(t => t.Title).HasMaxLength(200).IsRequired();
            entity.Property(t => t.Bio).HasMaxLength(2000);
            entity.Property(t => t.PricePerHourSpanish).HasColumnType("decimal(10,2)");
            entity.Property(t => t.PricePerHourEnglish).HasColumnType("decimal(10,2)");
            entity.Property(t => t.Location).HasMaxLength(200);
        });

        // Availability
        modelBuilder.Entity<Availability>(entity =>
        {
            entity.HasOne(a => a.TeacherProfile)
                  .WithMany(t => t.Availabilities)
                  .HasForeignKey(a => a.TeacherProfileId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // LessonType
        modelBuilder.Entity<LessonType>(entity =>
        {
            entity.Property(l => l.Name).HasMaxLength(200).IsRequired();
            entity.Property(l => l.Description).HasMaxLength(1000);
            entity.Property(l => l.Price).HasColumnType("decimal(10,2)");
            entity.HasOne(l => l.TeacherProfile)
                  .WithMany(t => t.LessonTypes)
                  .HasForeignKey(l => l.TeacherProfileId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Booking
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.Property(b => b.Price).HasColumnType("decimal(10,2)");
            entity.Property(b => b.StudentNotes).HasMaxLength(500);
            entity.Property(b => b.TeacherNotes).HasMaxLength(500);
            entity.Property(b => b.CancellationReason).HasMaxLength(500);
            entity.HasOne(b => b.Student)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(b => b.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(b => b.LessonType)
                  .WithMany(l => l.Bookings)
                  .HasForeignKey(b => b.LessonTypeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Review
        modelBuilder.Entity<Review>(entity =>
        {
            entity.Property(r => r.Comment).HasMaxLength(1000).IsRequired();
            entity.Property(r => r.Rating).IsRequired();
            entity.HasOne(r => r.Student)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(r => r.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
    }
}
