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
DISCORD_USERNAME="${DISCORD_USERNAME:-OpenLayout Backup Bot}"
DISCORD_AVATAR_URL="${DISCORD_AVATAR_URL:-}"
APP_NAME="${APP_NAME:-21oss}"

TIMESTAMP="$(TZ="$TIMEZONE" date +%Y%m%d_%H%M%S)"
HUMAN_TIME="$(TZ="$TIMEZONE" date '+%Y-%m-%d %H:%M:%S %Z')"
FILE_NAME="postgres_${TIMESTAMP}.sql.gz"
FILE_PATH="${BACKUP_DIR}/${FILE_NAME}"
S3_OBJECT="$(printf '%s:%s/%s/%s' "$RCLONE_REMOTE_NAME" "$S3_BUCKET" "${S3_PREFIX%/}" "$FILE_NAME")"

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

notify_discord() {
  status="$1"
  title="$2"
  color="$3"
  details="$4"

  if [ -z "$DISCORD_WEBHOOK_URL" ]; then
    return 0
  fi

  ESCAPED_TITLE="$(json_escape "$title")"
  ESCAPED_DETAILS="$(json_escape "$details")"
  ESCAPED_APP_NAME="$(json_escape "$APP_NAME")"
  ESCAPED_HOSTNAME="$(json_escape "$(hostname)")"
  ESCAPED_FILE_NAME="$(json_escape "$FILE_NAME")"
  ESCAPED_HUMAN_TIME="$(json_escape "$HUMAN_TIME")"
  ESCAPED_S3_PATH="$(json_escape "s3://${S3_BUCKET}/${S3_PREFIX%/}/")"

  AVATAR_FRAGMENT=""
  if [ -n "$DISCORD_AVATAR_URL" ]; then
    ESCAPED_AVATAR_URL="$(json_escape "$DISCORD_AVATAR_URL")"
    AVATAR_FRAGMENT=", \"avatar_url\": \"${ESCAPED_AVATAR_URL}\""
  fi

  curl -fsSL -X POST "$DISCORD_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"${DISCORD_USERNAME}\"${AVATAR_FRAGMENT},
      \"embeds\": [
        {
          \"title\": \"${ESCAPED_TITLE}\",
          \"description\": \"${ESCAPED_DETAILS}\",
          \"color\": ${color},
          \"fields\": [
            { \"name\": \"App\", \"value\": \"${ESCAPED_APP_NAME}\", \"inline\": true },
            { \"name\": \"Host\", \"value\": \"${ESCAPED_HOSTNAME}\", \"inline\": true },
            { \"name\": \"Status\", \"value\": \"${status}\", \"inline\": true },
            { \"name\": \"File\", \"value\": \"${ESCAPED_FILE_NAME}\", \"inline\": false },
            { \"name\": \"Target\", \"value\": \"${ESCAPED_S3_PATH}\", \"inline\": false },
            { \"name\": \"Time\", \"value\": \"${ESCAPED_HUMAN_TIME}\", \"inline\": false }
          ]
        }
      ]
    }" >/dev/null || true
}

cleanup() {
  rm -f "$FILE_PATH"
}

on_error() {
  notify_discord "FAILURE" "Backup Failed" "15158332" "Database backup gagal. Cek log schedule task Dokploy untuk detail error."
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

notify_discord "SUCCESS" "Backup Success" "3066993" "Backup PostgreSQL selesai dan berhasil di-upload. Size: ${FILE_SIZE}"

echo "Backup uploaded: ${S3_OBJECT}"
