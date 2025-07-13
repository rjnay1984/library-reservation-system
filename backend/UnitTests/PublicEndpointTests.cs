
using PublicApi.Endpoints;

namespace UnitTests;

public class PublicEndpointTests
{
    [Fact]
    public void PublicEndpointTest()
    {
        Assert.True(true);
        var response = TestEndpoints.HandleTestEndpoint("Public endpoint accessed.").Result;
        Assert.NotNull(response);
        Assert.Equal("Public endpoint accessed.", response.Value.Message);
    }
}
