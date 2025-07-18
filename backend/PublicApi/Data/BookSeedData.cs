using Bogus;

using PublicApi.Entities;

namespace PublicApi.Data;

public static class BookSeedData
{
    public static List<Book> Books { get; set; } = [];
    public static List<string> Authors { get; set; } = [];

    public static List<Book> Init()
    {
        List<string> authors = InitAuthors();
        // Implementation for seeding book data
        var bookFaker = new Faker<Book>()
            .RuleFor(b => b.Id, f => new Guid())
            .RuleFor(b => b.Title, f => f.Lorem.Sentance())
            .RuleFor(b => b.Author, f => f.PickRandom(authors))
            .RuleFor(b => b.ISBN, f => f.Random.Number(100000000, 900000000).ToString())
            .RuleFor(b => b.PublishedDate, f => f.Date.Past(f.Random.Number(1, 50)).ToUniversalTime());

        Books = [.. bookFaker.Generate(100)];
        return Books;
    }

    public static List<string> InitAuthors()
    {
        var faker = new Faker();
        Authors = [.. Enumerable.Range(0, 10).Select(_ => faker.Name.FirstName() + " " + faker.Name.LastName())];
        return Authors;
    }
}