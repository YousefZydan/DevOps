# Troubleshooting

## Backend container restarts

```bash
docker compose logs backend --tail 200
```

Common causes:

- `Jwt:Key must be at least 32 characters`
- SQL not healthy yet (`ConnectionStrings__Clinic`)
- Invalid Firebase JSON (warning only; API should still start)

## `/health/ready` is unhealthy

Database is down or the connection string host is wrong. Inside compose the host must be `db`, not `localhost`.

## Frontend loads but API calls fail

- Empty `VITE_API_BASE_URL` requires Caddy to proxy `/api` (default).
- If you set an absolute API URL, also add it to `CORS_ALLOWED_ORIGINS`.
- Rebuild the frontend image after changing `VITE_API_BASE_URL`.

## Caddy certificate errors

- DNS A records must point at this VPS
- Ports 80/443 open
- `DOMAIN` matches the certificate name

## Login works locally but not in Docker

Check `Cors__AllowedOrigins` includes the exact browser origin, including `https://`.

## Rollback

1. Restore a DB backup if a migration ran
2. `docker compose ... up -d` with a previous image tag (`:<git-sha>`)
