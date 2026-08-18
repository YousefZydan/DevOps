using System.Net;
using Serilog;

namespace Clinic.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next, IHostEnvironment environment, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            object payload = environment.IsDevelopment()
                ? new { error = "An unexpected error occurred.", detail = ex.Message }
                : new { error = "An unexpected error occurred." };

            await context.Response.WriteAsJsonAsync(payload);
        }
    }
}
