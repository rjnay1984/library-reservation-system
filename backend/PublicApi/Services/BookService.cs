using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

using PublicApi.Data;
using PublicApi.Entities;

namespace PublicApi.Services;

public class BookService(LibraryDbContext context) : IBookService
{
    private readonly LibraryDbContext _context = context;

    public async Task<int> GetTotalBooksCountAsync()
    {
        return await _context.Books.CountAsync();
    }

    public async Task<IEnumerable<Book>> GetAllBooksAsync(int page, int perPage)
    {
        if (page < 1) page = 1;
        if (perPage < 1) perPage = 20;

        return await _context.Books
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();
    }

    public async Task<Book?> GetBookByIdAsync(Guid id)
    {
        return await _context.Books.FindAsync(id);
    }

    public async Task<Book?> GetBookByIsbnAsync(string isbn)
    {
        return await _context.Books.FirstOrDefaultAsync(b => b.ISBN == isbn);
    }

    public async Task<Book> CreateBookAsync(Book book)
    {
        book.CreatedAt = DateTime.UtcNow;
        book.UpdatedAt = DateTime.UtcNow;

        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
    }

    public async Task<Book?> UpdateBookAsync(Guid id, Book book)
    {
        var existingBook = await _context.Books.FindAsync(id);
        if (existingBook == null)
            return null;

        existingBook.Title = book.Title;
        existingBook.Author = book.Author;
        existingBook.ISBN = book.ISBN;
        existingBook.PublishedDate = book.PublishedDate;
        existingBook.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingBook;
    }

    public async Task<bool> DeleteBookAsync(Guid id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return false;

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BookExistsAsync(Guid id)
    {
        return await _context.Books.AnyAsync(b => b.Id == id);
    }
}