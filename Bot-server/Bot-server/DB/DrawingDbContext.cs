using Microsoft.EntityFrameworkCore;
using Bot_server.Models;

namespace Bot_server.DB
{
    public class DrawingDbContext : DbContext
    {
        public DrawingDbContext(DbContextOptions<DrawingDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Drawing> Drawings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // הגדרות יחסים בין טבלאות

            modelBuilder.Entity<User>()
                .HasMany(u => u.Images)
                .WithOne(i => i.User)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Image>()
                .HasMany(i => i.Commands)
                .WithOne(d => d.Image)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.Cascade);

            // אפשר להוסיף כאן עוד קונפיגורציות אם צריך

            base.OnModelCreating(modelBuilder);
        }
    }
}
