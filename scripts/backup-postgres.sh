#!/usr/bin/env bash
set -Eeuo pipefail

# Daily PostgreSQL backup:
# - dump from Docker container
# - gzip to temp file
# - upload single .sql.gz to S3 via rclone
# - notify Discord on success/failure
# - always remove temp local file

required_vars=(
  DB_CONTAINER_FILTER
  DB_NAME
  DB_USER
  RCLONE_REMOTE
  S3_BUCKET
)

for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    echo "Missing required env: ${var_name}" >&2
    exit 1
  fi
done

BACKUP_DIR="${BACKUP_DIR:-/tmp/openlayout-backups}"
S3_PREFIX="${S3_PREFIX:-backups}"
TIMEZONE="${TIMEZONE:-Asia/Jakarta}"
USE_SUDO_DOCKER="${USE_SUDO_DOCKER:-1}"
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"
RCLONE_EXTRA_ARGS="${RCLONE_EXTRA_ARGS:---s3-no-check-bucket --transfers 1 --checkers 1 --stats-one-line}"

TIMESTAMP="$(TZ="$TIMEZONE" date +%Y%m%d_%H%M%S)"
FILE_NAME="postgres_${TIMESTAMP}.sql.gz"
FILE_PATH="${BACKUP_DIR}/${FILE_NAME}"
S3_OBJECT="${RCLONE_REMOTE}:${S3_BUCKET}/${S3_PREFIX%/}/${FILE_NAME}"

docker_cmd() {
  if [ "$USE_SUDO_DOCKER" = "1" ]; then
    sudo docker "$@"
  else
    docker "$@"
  fi
}

notify_discord() {
  local status="$1"
  local message="$2"

  if [ -z "$DISCORD_WEBHOOK_URL" ]; then
    return 0
  fi

  curl -fsSL -X POST "$DISCORD_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$(printf '{"content":"[%s] %s"}' "$status" "$message")" >/dev/null || true
}

cleanup() {
  rm -f "$FILE_PATH"
}

on_error() {
  notify_discord "FAILURE" "Backup gagal: ${FILE_NAME} on $(hostname)"
}

trap cleanup EXIT
trap on_error ERR

DB_CONTAINER_NAME="$(
  docker_cmd ps \
    --filter "name=${DB_CONTAINER_FILTER}" \
    --format '{{.Names}}' \
  | head -n 1
)"

if [ -z "$DB_CONTAINER_NAME" ]; then
  echo "Container not found for filter: ${DB_CONTAINER_FILTER}" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

docker_cmd exec "$DB_CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$FILE_PATH"

FILE_SIZE="$(du -h "$FILE_PATH" | awk '{print $1}')"

# shellcheck disable=SC2086
rclone copyto "$FILE_PATH" "$S3_OBJECT" $RCLONE_EXTRA_ARGS

notify_discord "SUCCESS" "Backup sukses: ${FILE_NAME} (${FILE_SIZE}) -> s3://${S3_BUCKET}/${S3_PREFIX%/}/"

echo "Backup uploaded: ${S3_OBJECT}"
