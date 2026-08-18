# Architecture

```text
Client (browser)
    HTTPS
Reverse proxy (Caddy)
    ├── /                 Frontend container (nginx + Vite build)
    ├── /api/*            Backend container (Kestrel / Clinic.dll)
    ├── /notificationHub  Backend SignalR
    └── /health*          Backend health checks
            │
     ┌──────┴──────┐
  SQL Server     Redis (optional distributed cache)
```

## Frontend

- Vite 5 + React 19 + React Router
- Production image: Node build → nginx static files
- API base URL: `VITE_API_BASE_URL` (empty = same origin)

## Backend

- ASP.NET Core 9, Clean-ish layers: Clinic, Application, Domain, Infrastructure
- EF Core + SQL Server
- JWT auth, Identity roles, FluentValidation
- SignalR notifications, Firebase (optional if credentials missing)
- Health: `/health/live`, `/health/ready`, `/health`
- Rate limiting on login/register/forgot-password
- Swagger only in Development

## Data

Existing EF migrations ship with the repo. Set `APPLY_MIGRATIONS=true` so the API applies them on startup. Do not use `EnsureCreated` against production.

## Scaling model

The API is designed to stay mostly stateless (JWT, SQL, Redis). Multiple backend replicas can sit behind Caddy/nginx. The current compose file runs one replica of each service. See [SCALING.md](SCALING.md).
