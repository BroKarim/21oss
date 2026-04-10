#!/bin/sh
set -e

echo ">>> Running Prisma db push..."
prisma db push --skip-generate

echo ">>> Starting application..."
exec node server.js
