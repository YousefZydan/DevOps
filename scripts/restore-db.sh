#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/restore-db.sh backups/clinic-YYYYMMDDThhmmssZ.bak

if [ $# -lt 1 ]; then
  echo "Usage: $0 <backup-file.bak>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

SRC="$1"
docker compose cp "$SRC" db:/var/opt/mssql/backup/restore.bak
docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd \
  -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" \
  -Q "ALTER DATABASE [Clinic] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; RESTORE DATABASE [Clinic] FROM DISK = N'/var/opt/mssql/backup/restore.bak' WITH REPLACE; ALTER DATABASE [Clinic] SET MULTI_USER;"
echo "Restore completed from $SRC"
