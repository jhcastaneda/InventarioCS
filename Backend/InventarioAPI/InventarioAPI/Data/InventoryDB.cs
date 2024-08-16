using InventarioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioAPI.Data
{
    public class InventoryDB : DbContext
    {
        public InventoryDB(DbContextOptions<InventoryDB> options) : base(options) { }

        public DbSet<Products> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Products>()
                .Property(p => p.createdAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Products>()
                .Property(p => p.updatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnUpdate();

            base.OnModelCreating(modelBuilder);
        }
    }
}
