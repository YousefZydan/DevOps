#!/usr/bin/env bash
# Run on a fresh Ubuntu 24.04 VPS as a user with sudo.
# Usage: curl -fsSL https://raw.githubusercontent.com/YousefZydan/DevOps/main/scripts/bootstrap-vps.sh | bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/YousefZydan/DevOps.git}"
APP_DIR="${APP_DIR:-/opt/devops}"

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this as a normal user with sudo, not as root."
  exit 1
fi

sudo apt-get update
sudo apt-get install -y ca-certificates curl git ufw

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi

sudo usermod -aG docker "$USER"

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

if [ ! -d "$APP_DIR/.git" ]; then
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created $APP_DIR/.env — edit it before starting the stack."
fi

echo
echo "Log out and back in (or run: newgrp docker), then:"
echo "  cd $APP_DIR"
echo "  nano .env"
echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo "  curl -fsS https://YOUR_DOMAIN/health/live"
