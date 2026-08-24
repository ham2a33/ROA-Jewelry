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

- `DATABASE_URL=postgresql://postgres:postgres@roa-postgres:5432/roa_jewelry?schema=public`
- `NEXT_PUBLIC_SITE_URL=https://roa-jewerly.com`
- `AUTH_SECRET=<min 32 chars>`

Build args:

- `NEXT_PUBLIC_SITE_URL=https://roa-jewerly.com`
- `AUTH_SECRET=<build placeholder, min 32 chars>`

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
