# Web App

`apps/web` is the Next.js storefront application.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase Auth + PostgreSQL
- Drizzle ORM
- Stripe Checkout

## Setup

From repo root:

```bash
bun install
cp apps/web/.env.example apps/web/.env.local
```

## Scripts

Run from `apps/web`:

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run check-types
bun run test
bun run test:e2e
bun run seed
```

## Test Layout

- Unit specs: `src/**/__specs__/**/*.spec.ts[x]`
- E2E specs: `tests/e2e/**/*.e2e.ts`

## Environment Variables

See `apps/web/.env.example` for required values.

Critical variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`
