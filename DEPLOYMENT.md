# Deployment

## 0. Create the server (you must do this)

This stack needs **x86/amd64**, about **4 GB RAM**, and Docker. SQL Server's official Linux image does not run on ARM, and 1 GB free VMs are too small.

**Free options checked:** Oracle Always Free ARM cannot run SQL Server. Oracle/AWS/Azure free 1 GB VMs cannot host SQL Server + API + frontend together. There is no realistic always-free VPS for this exact compose file.

**Recommended (cheapest that actually fits):** [Hetzner Cloud](https://www.hetzner.com/cloud) x86 plan with **4 GB RAM** (CX22 or CX23 in the console), about €4–5/month, billed hourly.

1. Open https://www.hetzner.com/cloud and create an account (credit card required).
2. Click **New project** → name it `medora`.
3. Click **Add Server**.
4. Location: **Helsinki (hel1)** or **Falkenstein (fsn1)**.
5. Image: **Ubuntu 24.04**.
6. Type: cheapest **x86 (Intel/AMD)** plan with **4 GB RAM**. Do not pick ARM/CAX.
7. SSH key: **Add SSH key** → paste your public key (`type $env:USERPROFILE\.ssh\id_ed25519.pub` on Windows). If you have no key yet: `ssh-keygen -t ed25519 -C "medora-vps"`.
8. Name the server `medora`.
9. Click **Create & Buy now**.
10. Copy the **public IPv4**.
11. From PowerShell: `ssh root@THE_IP`
12. Create a deploy user:
    ```bash
    adduser deploy
    usermod -aG sudo deploy
    rsync -a /root/.ssh/ /home/deploy/.ssh/
    chown -R deploy:deploy /home/deploy/.ssh
    ```
13. Disconnect, then: `ssh deploy@THE_IP`
14. Run:
    ```bash
    curl -fsSL https://raw.githubusercontent.com/YousefZydan/DevOps/main/scripts/bootstrap-vps.sh | bash
    ```
15. Send back: the public IP, and the output of `docker compose version` after you log out/in.

A domain can wait until the stack answers on `http://THE_IP/health/live`. HTTPS needs DNS first.

---

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
