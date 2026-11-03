#!/bin/sh
set -e

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${AUTH_SECRET:?AUTH_SECRET is required}"
: "${NEXT_DEPLOYMENT_ID:?NEXT_DEPLOYMENT_ID is required}"

if [ "${#AUTH_SECRET}" -lt 32 ]; then
  echo "AUTH_SECRET must contain at least 32 characters."
  exit 1
fi

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
  .catch((error) => {
    const code = String(error.code || 'unknown');
    console.error('PostgreSQL connection failed (code ' + code + ').');

    const permanent =
      code.startsWith('28') ||
      code === '3D000' ||
      code === '42501' ||
      code === 'ERR_INVALID_URL';
    const transient =
      code.startsWith('08') ||
      ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENETUNREACH', 'ENOTFOUND', 'EAI_AGAIN', '57P01', '57P03'].includes(code);

    if (permanent || !transient) {
      process.exit(2);
    }
    process.exit(1);
  });
"; then
      echo "PostgreSQL is ready."
      return 0
    else
      connection_status=$?
      if [ "$connection_status" -eq 2 ]; then
        echo "PostgreSQL rejected the connection configuration or returned a non-retryable error. Verify the existing login role, database, and DATABASE_URL; no credentials were printed."
        exit 78
      fi
    fi
    echo "PostgreSQL not ready (attempt ${attempt}/30), retrying in 2s..."
    attempt=$((attempt + 1))
    sleep 2
  done
  echo "PostgreSQL did not become ready in time."
  exit 1
}

# A named volume mounted at /app/public/uploads hides the directory baked into
# the image. Seed missing files from the image without replacing any files that
# already live in the persistent volume.
mkdir -p /app/public/uploads
if [ -d /app/uploads-seed ]; then
  cp -an /app/uploads-seed/. /app/public/uploads/
fi

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
