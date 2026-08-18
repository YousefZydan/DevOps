using System.Threading.RateLimiting;
using Clinic.Middleware;
using Domain.Entities;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Infrastructure.Data;
using Infrastructure.ExtentionMethods;
using Infrastructure.Hubs;
using Infrastructure.Seeding;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MyProject.Infrastructure.Extensions;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentName()
    .Enrich.WithMachineName()
    .WriteTo.Console(new RenderedCompactJsonFormatter())
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Host.UseSerilog((ctx, services, config) =>
    {
        config
            .ReadFrom.Configuration(ctx.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithEnvironmentName()
            .WriteTo.Console(new RenderedCompactJsonFormatter());

        if (ctx.HostingEnvironment.IsDevelopment())
        {
            config.WriteTo.File("logs2/app-log-.txt", rollingInterval: RollingInterval.Day);
        }
    });

    var configuration = builder.Configuration;
    var jwtKey = configuration["Jwt:Key"] ?? string.Empty;
    if (jwtKey.Length < 32)
    {
        if (EF.IsDesignTime)
        {
            Log.Warning("Jwt:Key is missing; ignored during EF design-time.");
        }
        else
        {
            throw new InvalidOperationException("Jwt:Key must be at least 32 characters. Set Jwt__Key.");
        }
    }

    builder.Services.AddControllers();
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddServices(configuration);
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var redis = configuration["Redis:Connection"];
    if (!string.IsNullOrWhiteSpace(redis))
    {
        builder.Services.AddStackExchangeRedisCache(options => options.Configuration = redis);
    }
    else
    {
        builder.Services.AddDistributedMemoryCache();
    }

    var allowedOrigins = (configuration["Cors:AllowedOrigins"] ?? "http://localhost:3000")
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        options.AddPolicy("auth", context =>
            RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                }));

        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
            RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 120,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                }));
    });

    var connectionString = configuration.GetConnectionString("Clinic") ?? string.Empty;
    var healthChecks = builder.Services.AddHealthChecks()
        .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

    if (!string.IsNullOrWhiteSpace(connectionString))
    {
        healthChecks.AddSqlServer(connectionString, name: "sql", tags: ["ready"]);
        healthChecks.AddDbContextCheck<ApplicationDbContext>(tags: ["ready"]);
    }

    TryInitializeFirebase(configuration);

    var app = builder.Build();

    app.UseForwardedHeaders();
    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseSerilogRequestLogging();
    app.UseMiddleware<SecurityHeadersMiddleware>();
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Clinic API");
            c.RoutePrefix = "swagger";
        });
    }

    var applyMigrations = configuration.GetValue("APPLY_MIGRATIONS", app.Environment.IsDevelopment());
    if (applyMigrations && !string.IsNullOrWhiteSpace(connectionString))
    {
        app.ApplyMigrations();
    }

    var seedDatabase = configuration.GetValue("SEED_DATABASE", app.Environment.IsDevelopment());
    if (seedDatabase)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await DefaultRolesAndUsersSeeder.SeedAsync(roleManager, userManager);
            await ApplicationSeeder.SeedAsync(context, userManager);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Database seeding failed");
            if (app.Environment.IsDevelopment())
            {
                throw;
            }
        }
    }

    app.UseCors("Frontend");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    var healthJson = new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { status = report.Status.ToString() });
        }
    };

    app.MapHealthChecks("/health/live", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("live"),
        ResponseWriter = healthJson.ResponseWriter
    });
    app.MapHealthChecks("/health/ready", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready"),
        ResponseWriter = healthJson.ResponseWriter
    });
    app.MapHealthChecks("/health", healthJson);

    app.MapControllers();
    app.MapHub<NotificationHub>("/notificationHub");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}

static void TryInitializeFirebase(IConfiguration configuration)
{
    if (FirebaseApp.DefaultInstance != null)
    {
        return;
    }

    var json = Environment.GetEnvironmentVariable("FIREBASE_CREDENTIALS_JSON");
    GoogleCredential? credential = null;

    if (!string.IsNullOrWhiteSpace(json))
    {
        credential = GoogleCredential.FromJson(json);
    }
    else
    {
        var relativePath = configuration["Firebase:CredentialsPath"];
        if (!string.IsNullOrWhiteSpace(relativePath))
        {
            var fullPath = Path.IsPathRooted(relativePath)
                ? relativePath
                : Path.Combine(Directory.GetCurrentDirectory(), relativePath);
            if (File.Exists(fullPath))
            {
                credential = GoogleCredential.FromFile(fullPath);
            }
        }
    }

    if (credential == null)
    {
        Log.Warning("Firebase credentials were not provided. Push notifications will be unavailable.");
        return;
    }

    FirebaseApp.Create(new AppOptions { Credential = credential });
    Log.Information("Firebase initialized");
}

public partial class Program;
