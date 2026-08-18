#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/backup-db.sh
# Requires: docker compose stack running, .env loaded.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$OUT_DIR"
FILE="$OUT_DIR/clinic-$STAMP.bak"

docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd \
  -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" \
  -Q "BACKUP DATABASE [Clinic] TO DISK = N'/var/opt/mssql/data/clinic.bak' WITH INIT"

docker compose cp db:/var/opt/mssql/data/clinic.bak "$FILE"
echo "Backup written to $FILE"
echo "Keep at least 7 daily backups. Delete files older than 14 days:"
find "$OUT_DIR" -name 'clinic-*.bak' -mtime +14 -delete || true
