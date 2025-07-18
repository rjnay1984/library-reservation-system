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
                    List<Book> seedBooks = BookSeedData.Init();
                    context.Set<Book>().AddRange(seedBooks);
                    context.SaveChanges();
                }
            })
            .UseAsyncSeeding(async (context, _, cancellationToken) =>
            {
                var testBook = await context.Set<Book>().FirstOrDefaultAsync(b => b.Title == "Test Book", cancellationToken);
                if (testBook == null)
                {
                    List<Book> seedBooks = BookSeedData.Init();
                    context.Set<Book>().AddRange(seedBooks);
                    await context.SaveChangesAsync(cancellationToken);
                }
            });
}