using PublicApi.Entities;

namespace PublicApi.Services;

public interface IBookService
{
    Task<int> GetTotalBooksCountAsync();
    Task<IEnumerable<Book>> GetAllBooksAsync(int page, int perPage);
    Task<Book?> GetBookByIdAsync(Guid id);
    Task<Book?> GetBookByIsbnAsync(string isbn);
    Task<Book> CreateBookAsync(Book book);
    Task<Book?> UpdateBookAsync(Guid id, Book book);
    Task<bool> DeleteBookAsync(Guid id);
}