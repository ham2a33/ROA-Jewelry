#!/bin/sh
set -e

wait_for_postgres() {
  echo "Waiting for PostgreSQL..."
  attempt=1
  while [ "$attempt" -le 30 ]; do
    if node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client
  .connect()
  .then(() => client.end())
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
"; then
      echo "PostgreSQL is ready."
      return 0
    fi
    echo "PostgreSQL not ready (attempt ${attempt}/30), retrying in 2s..."
    attempt=$((attempt + 1))
    sleep 2
  done
  echo "PostgreSQL did not become ready in time."
  exit 1
}

run_migrations() {
  echo "Running database migrations..."
  attempt=1
  while [ "$attempt" -le 5 ]; do
    if npx prisma migrate deploy; then
      echo "Migrations applied successfully."
      return 0
    fi
    echo "Migration attempt ${attempt}/5 failed, retrying in 5s..."
    attempt=$((attempt + 1))
    sleep 5
  done
  echo "Migration failed after 5 attempts."
  exit 1
}

wait_for_postgres
run_migrations

echo "Starting Next.js on port ${PORT:-3000}..."
exec npm start
