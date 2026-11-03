# ROA Jewelry

Premium e-commerce storefront and admin for ROA Jewelry.

## Local development

### Option A — Next.js dev server + PostgreSQL in Docker (recommended)

1. Copy environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL (publishes `5432` via `docker-compose.local.yml`):

```bash
npm run db:up
```

3. Apply migrations and seed:

```bash
npx prisma migrate deploy
npm run db:seed
```

4. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

5. Stop PostgreSQL when finished:

```bash
npm run db:down
```

### Option B — Full stack in Docker (production-like)

```bash
cp .env.example .env
npm run docker:up
```

App: http://localhost:3000  
PostgreSQL: `localhost:5432` (from host)

Stop:

```bash
npm run docker:down
```

## Production (Dokploy)

Deploy `docker-compose.yml` only (without `docker-compose.local.yml`).

Routing:

```
roa-jewerly.com → Traefik → roa-app:3000 → roa-postgres:5432
```

Required runtime env in Dokploy:

- `DATABASE_URL=<production PostgreSQL URL using hostname roa-postgres>`
- `NEXT_PUBLIC_SITE_URL=https://roa-jewerly.com`
- `AUTH_SECRET=<min 32 chars>`
- `NEXT_DEPLOYMENT_ID=<stable id for the active release>`

Build args:

- `NEXT_PUBLIC_SITE_URL=https://roa-jewerly.com`
- `NEXT_DEPLOYMENT_ID=<the same value as runtime>`

Set the same non-empty `NEXT_DEPLOYMENT_ID` for the image build and running container. Change it for every release; Next.js then adds the deployment identifier to client navigation/action requests and prevents old cached client assets from being mixed with the new server.

After each production deploy, admins should refresh open browser tabs once. If a stale tab still submits an old action, the UI shows a refresh message and no database mutation is performed.

Media uploads use `POST /api/admin/media/upload` (not Server Actions) so large images work even when an older build still has the default 1 MB Server Action limit.

### Fresh production stack (parallel v2 deployment)

Use `docker-compose.clean.yml` as a **separate Dokploy Compose application** to start a new empty database and uploads volume without mounting or deleting the legacy volumes. It uses the distinct external resources `roa_jewelry_postgres_data_v2`, `roa_jewelry_uploads_v2`, and `roa-jewelry-internal-v2`. Create those resources only after confirming the v2 names do not already exist. Keep the old PostgreSQL service running until the new app is verified.

Configure these environment variables in the new Dokploy application:

- `POSTGRES_USER`: generate a unique, URL-safe initialization superuser (for example, a `roa_init_` prefix followed by random lowercase hex). The application does not use this role.
- `POSTGRES_PASSWORD`: generate at least 32 random bytes as lowercase hex for the initialization superuser. This is not the app's login password.
- `APP_DB_USER` and `APP_DB_PASSWORD`: generate a separate application login role and 32-byte hex password. The init SQL creates this role without superuser privileges, grants database connectivity and schema ownership, and Compose uses it in `DATABASE_URL`.
- `POSTGRES_DB=roa_jewelry`
- `AUTH_SECRET`: generate at least 32 random bytes as hex.
- `NEXT_DEPLOYMENT_ID`: a unique release identifier; use the same value at build and runtime.
- `NEXT_PUBLIC_SITE_URL=https://roa-jewerly.com`

Do not reuse the old production credentials. The clean Compose file derives `DATABASE_URL` from the new application-role variables and internal hostname `roa-postgres`. It has no manual Traefik labels: configure both domains in the new app's Dokploy **Domains** tab (path `/`, container port `3000`, HTTPS enabled, HTTP redirected to HTTPS). Remove the old app's domains and stop only its app container at cutover; leave its PostgreSQL container and both legacy volumes untouched until verification is complete.

The app runs `prisma migrate deploy` at startup. Do not run `npm run db:seed` automatically in production: it creates sample catalog and homepage content, but no admin user or product images. On an empty database, create the first administrator through the one-time bootstrap form at `/admin/login`, then add real catalog content and upload authorized product photography through Admin Media. The catalog is expected to be empty until real products are added.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build (webpack)
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run db:up` — start local PostgreSQL only
- `npm run db:down` — stop local Docker stack
- `npm run docker:up` — build and start full local stack
- `npm run docker:down` — stop full local stack
- `npm run db:generate` — generate Prisma Client
- `npm run db:migrate` — create/apply migrations (dev)
- `npm run db:migrate:deploy` — apply migrations (CI/production)
- `npm run db:seed` — seed homepage, catalog, and CMS baseline data
