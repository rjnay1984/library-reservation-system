var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors();

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

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Fuckin Cold"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            10,
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/public", () => new { Message = "This is a public endpoint." });

app.MapGet("/private", () => new { Message = "This is a private endpoint." })
.RequireAuthorization();
app.MapGet("/staff", () => new { Message = "This is a staff endpoint." })
.RequireAuthorization("IsStaff");
app.MapGet("/admin", () => new { Message = "This is an admin endpoint." })
.RequireAuthorization("IsAdmin");
app.MapGet("/either", () => new { Message = "This is an either endpoint." })
.RequireAuthorization("IsAdminOrStaff");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
