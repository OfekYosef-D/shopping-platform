# Shopping Platform Monorepo

Production-oriented e-commerce workspace built with `Next.js 16`, `React 19`, `Drizzle ORM`, and `Supabase`.

## Workspace Layout

- `apps/web`: storefront app (App Router)
- `packages/eslint-config`: shared ESLint flat configs
- `packages/typescript-config`: shared TypeScript base configs
- `packages/ui`: shared React UI package

## Prerequisites

- `bun@1.3.9` (declared in root `packageManager`)
- Node.js 18+

## Setup

```bash
bun install
cp apps/web/.env.example apps/web/.env.local
```

## Common Commands

From repo root:

```bash
bun run dev
bun run build
bun run lint
bun run check-types
bun run test
bun run test:e2e
```

Scope to the web app:

```bash
turbo run dev --filter=web
```

## Testing

- Unit/integration: Vitest (`apps/web/src/**/__specs__/**/*.spec.ts[x]`)
- End-to-end: Playwright (`apps/web/tests/e2e/**/*.e2e.ts`)

## CI

GitHub Actions workflow at `.github/workflows/ci.yml` runs:

- `bun run lint`
- `bun run check-types`
- `bun run test`

Optional E2E can be run manually through `workflow_dispatch`.

## Workflow Notes

- Use shared configs from `packages/eslint-config` and `packages/typescript-config`.
- Keep E2E tests outside `src/` to avoid accidental app bundling.
- Do not commit local auth/test artifacts (`auth.json`, Playwright reports, screenshots).
