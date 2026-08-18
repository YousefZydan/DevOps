# Production notes

## Configuration

All secrets come from environment variables or `.env` (never Git).

| Variable | Purpose |
|---|---|
| `ConnectionStrings__Clinic` | SQL Server |
| `Jwt__Key` | Token signing, 32+ chars |
| `Cors__AllowedOrigins` | Browser origins |
| `APPLY_MIGRATIONS` | Run EF migrations on boot |
| `SEED_DATABASE` | Seed demo users (keep `false` in production) |
| `FIREBASE_CREDENTIALS_JSON` | Firebase service account JSON |
| `Redis__Connection` | `redis:6379` in compose |

## Security already applied

- Swagger disabled outside Development
- Admin-only role management endpoints
- Rate limits on auth endpoints
- Exception messages hidden in production
- Correlation IDs
- Security headers on API and Caddy
- Containers: backend runs as non-root; SQL is not published to the host
- Firebase/appsettings are gitignored

## Still your responsibility

- Rotate the seeded demo passwords if you ever set `SEED_DATABASE=true`
- Buy/point a domain
- Open firewall 80/443 only
- Store backups off-box
- Replace the default Grafana password if you start monitoring compose

## Backups

```bash
chmod +x scripts/*.sh
./scripts/backup-db.sh
./scripts/restore-db.sh backups/clinic-YYYYMMDDThhmmssZ.bak
```

Schedule daily via cron:

```cron
15 2 * * * /opt/devops/scripts/backup-db.sh
```

Keep copies off the VPS (S3, Backblaze, or your disk). Retention in the script deletes local files older than 14 days.

## Monitoring

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

Prometheus: `http://SERVER_IP:9090`  
Grafana: `http://SERVER_IP:3001`  

Do not expose these ports on the public internet without auth. Prefer SSH tunnels.

## Migrations

```bash
# automatic (compose)
APPLY_MIGRATIONS=true

# manual
docker compose exec backend dotnet Clinic.dll
# or from a workstation with the connection string:
dotnet ef database update --project Backend/Infrastructure --startup-project Backend/Clinic
```

Never drop/recreate the production database.
