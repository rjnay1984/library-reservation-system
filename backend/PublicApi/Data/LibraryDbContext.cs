using Microsoft.EntityFrameworkCore;

using PublicApi.Entities;

namespace PublicApi.Data;

public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder
            .UseSeeding((context, _) =>
            {
                var testBook = context.Set<Book>().FirstOrDefault(b => b.Title == "Test Book");
                if (testBook == null)
                {
                    context.Set<Book>().Add(new Book { Title = "Test Book", Author = "Test Author", ISBN = "1234567890", PublishedDate = DateTime.UtcNow.AddYears(-15) });
                    context.Set<Book>().Add(new Book { Title = "Test Book 2", Author = "Test Author2", ISBN = "0987654321", PublishedDate = DateTime.UtcNow.AddYears(-7) });
                    context.SaveChanges();
                }
            })
            .UseAsyncSeeding(async (context, _, cancellationToken) =>
            {
                var testBook = await context.Set<Book>().FirstOrDefaultAsync(b => b.Title == "Test Book", cancellationToken);
                if (testBook == null)
                {
                    context.Set<Book>().Add(new Book { Title = "Test Book", Author = "Test Author", ISBN = "1234567890", PublishedDate = DateTime.UtcNow.AddYears(-15) });
                    context.Set<Book>().Add(new Book { Title = "Test Book 2", Author = "Test Author2", ISBN = "0987654321", PublishedDate = DateTime.UtcNow.AddYears(-7) });
                    await context.SaveChangesAsync(cancellationToken);
                }
            });
}