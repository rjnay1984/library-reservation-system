namespace PublicApi.Entities;

public class Book : BaseEntity
{
    public required string Title { get; set; }
    public required string Author { get; set; }
    public required string ISBN { get; set; }
    public required DateTime PublishedDate { get; set; }
}