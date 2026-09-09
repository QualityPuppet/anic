var builder = WebApplication.CreateBuilder(args);

Startup.InitialiseBuilder(builder);
Startup.SetupDependencies(builder);

var app = builder.Build();



app.Run();