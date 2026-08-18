# Deployment

## 1. Prepare secrets

```bash
cp .env.example .env
```

Set at least:

- `MSSQL_SA_PASSWORD`
- `CONNECTION_STRING` (must use the same password)
- `Jwt__Key` (32+ random characters)
- `DOMAIN` (production hostname, e.g. `clinic.example.com`)
- `ACME_EMAIL`
- `CORS_ALLOWED_ORIGINS` (`https://clinic.example.com`)

Optional: `FIREBASE_CREDENTIALS_JSON`, Cloudinary, SMTP, Google OAuth.

## 2. DNS (you must do this)

Create:

| Record | Name | Value |
|---|---|---|
| A | `@` or `clinic` | VPS public IP |
| A | `api` | same VPS public IP |

Wait until `nslookup yourdomain.com` returns that IP.

## 3. Server

On an Ubuntu VPS:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
```

Clone this repository, copy `.env`, then:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Caddy will request Let's Encrypt certificates for `$DOMAIN` and `api.$DOMAIN`.

Ports 80 and 443 must be open.

## 4. GitHub Actions CD

CI already builds on every push.

To publish images to GHCR, pushes to `main` run `.github/workflows/cd.yml`.

To deploy over SSH, run the **CD / Deploy over SSH** workflow manually after adding GitHub secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_DIR` (path on the server, e.g. `/opt/devops`)
- `PRODUCTION_DOMAIN`

The VPS must be able to `docker pull` from `ghcr.io`. If pulls are denied, create a GitHub PAT with `read:packages` and `docker login ghcr.io` on the server.

## 5. Verify

```bash
curl -fsS https://yourdomain.com/health/live
curl -fsS https://yourdomain.com/health/ready
curl -I https://yourdomain.com
```

## 6. Rollback

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
# or pin an older sha:
# image: ghcr.io/yousefzydan/devops-backend:<git-sha>
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Restore the database with `scripts/restore-db.sh` if a migration went wrong.
