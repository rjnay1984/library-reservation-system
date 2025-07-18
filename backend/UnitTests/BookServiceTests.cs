using Microsoft.EntityFrameworkCore;

using PublicApi.Data;
using PublicApi.Entities;
using PublicApi.Services;

namespace UnitTests;

public class BookServiceTests
{
    private static LibraryDbContext GetDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<LibraryDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new LibraryDbContext(options);
    }

    private static BookService GetService(LibraryDbContext context)
    {
        return new BookService(context);
    }

    [Fact]
    public async Task GetAllBooksAsync_ReturnsAllBooks()
    {
        var context = GetDbContext(nameof(GetAllBooksAsync_ReturnsAllBooks));
        context.Books.Add(new Book { Title = "Book 1", Author = "Author 1", ISBN = "111", PublishedDate = DateTime.UtcNow });
        context.Books.Add(new Book { Title = "Book 2", Author = "Author 2", ISBN = "222", PublishedDate = DateTime.UtcNow });
        await context.SaveChangesAsync();

        var service = GetService(context);
        var books = await service.GetAllBooksAsync(1, 10);

        Assert.Equal(2, await context.Books.CountAsync());
        Assert.Equal(2, Enumerable.Count(books));
    }

    [Fact]
    public async Task GetBookByIdAsync_ReturnsBook_WhenExists()
    {
        var context = GetDbContext(nameof(GetBookByIdAsync_ReturnsBook_WhenExists));
        var book = new Book { Id = Guid.NewGuid(), Title = "Book", Author = "Author", ISBN = "123", PublishedDate = DateTime.UtcNow };
        context.Books.Add(book);
        await context.SaveChangesAsync();

        var service = GetService(context);
        var result = await service.GetBookByIdAsync(book.Id);

        Assert.NotNull(result);
        Assert.Equal(book.Title, result!.Title);
    }

    [Fact]
    public async Task GetBookByIdAsync_ReturnsNull_WhenNotExists()
    {
        var context = GetDbContext(nameof(GetBookByIdAsync_ReturnsNull_WhenNotExists));
        var service = GetService(context);

        var result = await service.GetBookByIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    [Fact]
    public async Task GetBookByIsbnAsync_ReturnsBook_WhenExists()
    {
        var context = GetDbContext(nameof(GetBookByIsbnAsync_ReturnsBook_WhenExists));
        var book = new Book { Title = "Book", Author = "Author", ISBN = "ABC", PublishedDate = DateTime.UtcNow };
        context.Books.Add(book);
        await context.SaveChangesAsync();

        var service = GetService(context);
        var result = await service.GetBookByIsbnAsync("ABC");

        Assert.NotNull(result);
        Assert.Equal(book.Title, result!.Title);
    }

    [Fact]
    public async Task CreateBookAsync_AddsBook()
    {
        var context = GetDbContext(nameof(CreateBookAsync_AddsBook));
        var service = GetService(context);
        var book = new Book { Title = "New Book", Author = "Author", ISBN = "NEW", PublishedDate = DateTime.UtcNow };

        var result = await service.CreateBookAsync(book);

        Assert.NotNull(result);
        Assert.Equal("New Book", result.Title);
        Assert.Equal(1, await context.Books.CountAsync());
    }

    [Fact]
    public async Task UpdateBookAsync_UpdatesBook_WhenExists()
    {
        var context = GetDbContext(nameof(UpdateBookAsync_UpdatesBook_WhenExists));
        var book = new Book { Title = "Old", Author = "A", ISBN = "X", PublishedDate = DateTime.UtcNow };
        context.Books.Add(book);
        await context.SaveChangesAsync();

        var service = GetService(context);
        var updated = new Book { Title = "New", Author = "B", ISBN = "Y", PublishedDate = DateTime.UtcNow };
        var result = await service.UpdateBookAsync(book.Id, updated);

        Assert.NotNull(result);
        Assert.Equal("New", result!.Title);
        Assert.Equal("B", result.Author);
    }

    [Fact]
    public async Task UpdateBookAsync_ReturnsNull_WhenNotExists()
    {
        var context = GetDbContext(nameof(UpdateBookAsync_ReturnsNull_WhenNotExists));
        var service = GetService(context);
        var updated = new Book { Title = "New", Author = "B", ISBN = "Y", PublishedDate = DateTime.UtcNow };

        var result = await service.UpdateBookAsync(Guid.NewGuid(), updated);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteBookAsync_RemovesBook_WhenExists()
    {
        var context = GetDbContext(nameof(DeleteBookAsync_RemovesBook_WhenExists));
        var book = new Book { Title = "Book", Author = "Author", ISBN = "DEL", PublishedDate = DateTime.UtcNow };
        context.Books.Add(book);
        await context.SaveChangesAsync();

        var service = GetService(context);
        var result = await service.DeleteBookAsync(book.Id);

        Assert.True(result);
        Assert.Equal(0, await context.Books.CountAsync());
    }

    [Fact]
    public async Task DeleteBookAsync_ReturnsFalse_WhenNotExists()
    {
        var context = GetDbContext(nameof(DeleteBookAsync_ReturnsFalse_WhenNotExists));
        var service = GetService(context);

        var result = await service.DeleteBookAsync(Guid.NewGuid());

        Assert.False(result);
    }

    [Fact]
    public async Task BookExistsAsync_ReturnsTrue_WhenExists()
    {
        var context = GetDbContext(nameof(BookExistsAsync_ReturnsTrue_WhenExists));
        var book = new Book { Title = "Book", Author = "Author", ISBN = "EXISTS", PublishedDate = DateTime.UtcNow };
        context.Books.Add(book);
        await context.SaveChangesAsync();

        var service = GetService(context);
        var result = await service.BookExistsAsync(book.Id);

        Assert.True(result);
    }

    [Fact]
    public async Task BookExistsAsync_ReturnsFalse_WhenNotExists()
    {
        var context = GetDbContext(nameof(BookExistsAsync_ReturnsFalse_WhenNotExists));
        var service = GetService(context);

        var result = await service.BookExistsAsync(Guid.NewGuid());

        Assert.False(result);
    }
}