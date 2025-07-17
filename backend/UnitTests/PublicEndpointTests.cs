
using PublicApi.Endpoints;

namespace UnitTests;

public class PublicEndpointTests
{
    [Fact]
    public async Task PublicEndpointTest()
    {
        var response = await TestEndpoints.HandleTestEndpoint("Public endpoint accessed.");
        Assert.NotNull(response.Value);
        Assert.Equal("Public endpoint accessed.", response.Value.Message);
    }
}