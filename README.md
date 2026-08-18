# Medora Clinic — Full-Stack

ASP.NET Core 9 API + Vite/React frontend, packaged for production with Docker, Caddy, GitHub Actions, and SQL Server.

## Repository layout

```text
Frontend/     Medora web app (Vite + React)
Backend/      Clinic API (.NET 9)
deploy/       Caddy and Prometheus config
scripts/      backup, restore, deploy, load test
.github/      CI and CD workflows
```

## Local development

### Backend

```bash
cd Backend
copy Clinic\appsettings.json.example Clinic\appsettings.json
# edit connection string and Jwt:Key (32+ chars)
dotnet restore Clinic.sln
dotnet build Clinic.sln
dotnet run --project Clinic
```

API default URL: `http://localhost:5127` (see `Backend/Clinic/Properties/launchSettings.json`).

### Frontend

```bash
cd Frontend
npm ci
copy .env.example .env
npm run dev
```

Vite runs on `http://localhost:3000` and proxies `/api` to the backend.

Leave `VITE_API_BASE_URL` empty so the browser uses same-origin `/api`.

## Docker (local HTTP)

```bash
copy .env.example .env
# set MSSQL_SA_PASSWORD, CONNECTION_STRING, Jwt__Key
docker compose up --build
```

Then open `http://localhost`. Frontend is served by Caddy; `/api` and `/health` go to the backend.

## Production

See [DEPLOYMENT.md](DEPLOYMENT.md) and [PRODUCTION.md](PRODUCTION.md).

Do not commit `.env`, Firebase JSON, or real JWT keys.
