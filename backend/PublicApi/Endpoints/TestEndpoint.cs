using System.Reflection.Metadata;

using Microsoft.AspNetCore.Http.HttpResults;

namespace PublicApi.Endpoints;

public static class TestEndpoints
{
    public static RouteGroupBuilder MapTestEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/public", () => HandleTestEndpoint("Public endpoint accessed."));

        group.MapGet("/private", () => HandleTestEndpoint("Private endpoint accessed."))
            .RequireAuthorization();

        group.MapGet("/staff", () => HandleTestEndpoint("Staff endpoint accessed."))
            .RequireAuthorization("IsStaff");

        group.MapGet("/admin", () => HandleTestEndpoint("Admin endpoint accessed."))
            .RequireAuthorization("IsAdmin");

        group.MapGet("/either", () => HandleTestEndpoint("Either endpoint accessed."))
            .RequireAuthorization("IsAdminOrStaff");

        return group;
    }

    public record TestEndpointResponse(string Message);

    public static Task<Ok<TestEndpointResponse>> HandleTestEndpoint(string message)
    {
        var response = new TestEndpointResponse(message);
        return Task.FromResult(TypedResults.Ok(response));
    }
}