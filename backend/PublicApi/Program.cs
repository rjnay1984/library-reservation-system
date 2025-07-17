using Microsoft.EntityFrameworkCore;

using PublicApi.Data;
using PublicApi.Endpoints;
using PublicApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors();
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("LibraryDb")));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Register services
builder.Services.AddScoped<IBookService, BookService>();

// Configure JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer");

builder.Services.AddAuthorization();

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("IsAdmin", policy => policy.RequireClaim("groups", "authentik Admins"));
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("IsStaff", policy => policy.RequireClaim("groups", "Library Staff"));
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("IsAdminOrStaff", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim("groups", "authentik Admins") ||
            context.User.HasClaim("groups", "Library Staff")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "v1"));
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/")
    .MapTestEndpoints()
    .WithTags("Test Endpoints");
app.MapGroup("/books")
    .MapBookEndpoints()
    .WithTags("Book Endpoints");

app.Run();
