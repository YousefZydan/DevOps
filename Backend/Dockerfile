# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Clinic.sln ./
COPY Clinic/Clinic.csproj Clinic/
COPY Application/Application.csproj Application/
COPY Domain/Domain.csproj Domain/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
COPY Clinic.Tests/Clinic.Tests.csproj Clinic.Tests/

RUN dotnet restore Clinic.sln

COPY . .
RUN dotnet publish Clinic/Clinic.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && adduser --disabled-password --gecos "" --uid 10001 appuser

COPY --from=build --chown=appuser:appuser /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_EnableDiagnostics=0

EXPOSE 8080
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8080/health/live || exit 1

ENTRYPOINT ["dotnet", "Clinic.dll"]
