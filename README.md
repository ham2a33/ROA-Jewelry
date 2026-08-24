# ROA Jewelry

Premium e-commerce storefront and admin for ROA Jewelry.

This repository is being built step by step. The current baseline is project architecture only: Next.js App Router, Prisma/PostgreSQL, CMS media, catalog entities, and homepage section data — without storefront or admin UI.

## Local database (Docker)

ROA Jewelry uses PostgreSQL 16 via Docker Compose. Other project containers are not used.

1. Copy `.env.example` to `.env` (keep `DATABASE_URL` as shown if using the compose service).
2. Start PostgreSQL:

```bash
npm run db:up
```

3. Apply migrations and seed:

```bash
npx prisma migrate deploy
npm run db:seed
```

4. Stop PostgreSQL when finished:

```bash
npm run db:down
```

The compose service uses container `roa-jewelry-postgres` and volume `roa_jewelry_postgres_data` on port `5432`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run db:up` — start local PostgreSQL (Docker)
- `npm run db:down` — stop local PostgreSQL (Docker)
- `npm run db:generate` — generate Prisma Client
- `npm run db:migrate` — create/apply migrations (dev)
- `npm run db:migrate:deploy` — apply migrations (CI/production)
- `npm run db:seed` — seed homepage, catalog, and CMS baseline data

Copy `.env.example` to `.env` and run `npm run db:up` before migrations.
