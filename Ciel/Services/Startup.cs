public static class Startup
{
    public static void InitialiseBuilder(WebApplicationBuilder builder)
    {
        // Add services to the container.
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowVueApp",
            policy => policy.WithOrigins("http://localhost:5173") // Your Vue dev port
                            .AllowAnyMethod()
                            .AllowAnyHeader());
        });

        builder.Services.AddControllers();
    }

    public static void SetupDependencies(WebApplicationBuilder builder)
    {
        DependencyResolver.BuildDependencies(builder);
    }

    public static void InitisaliseApp(WebApplication app)
    {
        app.UseHttpsRedirection();
        app.UseCors("AllowVueApp");
        app.MapControllers();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/openapi/v1.json", "v1");
            });
        }

        app.UseHttpsRedirection();
    }
}
