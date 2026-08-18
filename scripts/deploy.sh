#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Copy .env.example to .env and fill secrets first."
  exit 1
fi

docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans
sleep 15
curl -fsS "http://127.0.0.1/health/live"
echo
echo "Deployed. Configure DNS and HTTPS as documented in DEPLOYMENT.md"
