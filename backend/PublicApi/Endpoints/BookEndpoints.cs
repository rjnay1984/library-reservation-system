using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

using PublicApi.Entities;
using PublicApi.Services;

namespace PublicApi.Endpoints;

public static class BookEndpoints
{
    public static RouteGroupBuilder MapBookEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllBooks);
        group.MapGet("/{id}", GetBookById);
        group.MapGet("/isbn/{isbn}", GetBookByIsbn);
        group.MapPost("/", CreateBook).RequireAuthorization("IsStaff");
        group.MapPut("/{id}", UpdateBook).RequireAuthorization("IsStaff");
        group.MapDelete("/{id}", DeleteBook).RequireAuthorization("IsStaff");

        return group;
    }

    record IBookResponse(int Page, int PerPage, int TotalResults, int TotalPages, IEnumerable<Book> Data);

    private static async Task<Ok<IBookResponse>> GetAllBooks(
         IBookService bookService,
        [FromHeader(Name = "PerPage")] int? perPage = 20,
        [FromHeader(Name = "Page")] int? page = 1)
    {
        var actualPage = page.HasValue && page < 1 ? 1 : page ?? 1;
        var actualPerPage = perPage.HasValue && perPage < 1 ? 20 : perPage ?? 20;

        var totalResults = await bookService.GetTotalBooksCountAsync();
        var totalPages = (int)Math.Ceiling((double)totalResults / actualPerPage);
        var books = await bookService.GetAllBooksAsync(actualPage, actualPerPage);
        var response = new IBookResponse(actualPage, actualPerPage, totalResults, totalPages, books);
        return TypedResults.Ok(response);
    }

    private static async Task<Results<Ok<Book>, NotFound>> GetBookById(Guid id, IBookService bookService)
    {
        var book = await bookService.GetBookByIdAsync(id);
        return book is not null ? TypedResults.Ok(book) : TypedResults.NotFound();
    }

    private static async Task<Results<Ok<Book>, NotFound>> GetBookByIsbn(string isbn, IBookService bookService)
    {
        var book = await bookService.GetBookByIsbnAsync(isbn);
        return book is not null ? TypedResults.Ok(book) : TypedResults.NotFound();
    }

    private static async Task<Created<Book>> CreateBook(Book book, IBookService bookService)
    {
        var createdBook = await bookService.CreateBookAsync(book);
        return TypedResults.Created($"/books/{createdBook.Id}", createdBook);
    }

    private static async Task<Results<Ok<Book>, NotFound>> UpdateBook(Guid id, Book book, IBookService bookService)
    {
        var updatedBook = await bookService.UpdateBookAsync(id, book);
        return updatedBook is not null ? TypedResults.Ok(updatedBook) : TypedResults.NotFound();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteBook(Guid id, IBookService bookService)
    {
        var deleted = await bookService.DeleteBookAsync(id);
        return deleted ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}