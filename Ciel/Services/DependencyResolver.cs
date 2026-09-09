internal static class DependencyResolver
{
    internal static void BuildDependencies(WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<IRankingRepository, JsonRankingRepository>();
    }
}