#!/bin/sh
set -eu

required_vars="S3_BUCKET S3_REGION S3_ACCESS_KEY S3_SECRET_ACCESS_KEY"

for var_name in $required_vars; do
  eval "var_value=\${$var_name:-}"
  if [ -z "$var_value" ]; then
    echo "Missing required env: $var_name" >&2
    exit 1
  fi
done

DB_URL="${DATABASE_URL_UNPOOLED:-${DATABASE_URL:-}}"
if [ -z "$DB_URL" ]; then
  echo "Missing required env: DATABASE_URL_UNPOOLED or DATABASE_URL" >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-/tmp/openlayout-backups}"
S3_PREFIX="${S3_PREFIX:-backups}"
TIMEZONE="${TIMEZONE:-Asia/Jakarta}"
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"
RCLONE_REMOTE_NAME="${RCLONE_REMOTE_NAME:-OPENLAYOUTBACKUP}"

TIMESTAMP="$(TZ="$TIMEZONE" date +%Y%m%d_%H%M%S)"
FILE_NAME="postgres_${TIMESTAMP}.sql.gz"
FILE_PATH="${BACKUP_DIR}/${FILE_NAME}"
S3_OBJECT="$(printf '%s:%s/%s/%s' "$RCLONE_REMOTE_NAME" "$S3_BUCKET" "${S3_PREFIX%/}" "$FILE_NAME")"

notify_discord() {
  status="$1"
  message="$2"

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

trap cleanup EXIT INT TERM HUP
trap on_error ERR

mkdir -p "$BACKUP_DIR"

export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_TYPE="s3"
export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_PROVIDER="AWS"
export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_ACCESS_KEY_ID="$S3_ACCESS_KEY"
export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_REGION="$S3_REGION"

if [ -n "${S3_ENDPOINT:-}" ]; then
  export RCLONE_CONFIG_${RCLONE_REMOTE_NAME}_ENDPOINT="$S3_ENDPOINT"
fi

pg_dump "$DB_URL" | gzip > "$FILE_PATH"

FILE_SIZE="$(du -h "$FILE_PATH" | awk '{print $1}')"

rclone copyto "$FILE_PATH" "$S3_OBJECT" \
  --s3-no-check-bucket \
  --transfers 1 \
  --checkers 1 \
  --stats-one-line

notify_discord "SUCCESS" "Backup sukses: ${FILE_NAME} (${FILE_SIZE}) -> s3://${S3_BUCKET}/${S3_PREFIX%/}/"

echo "Backup uploaded: ${S3_OBJECT}"
