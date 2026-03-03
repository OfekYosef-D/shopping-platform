# AGENTS.md

## Objective

Keep `shopping-platform` maintainable, testable, and release-safe.

## Required Workflow

1. Start from a failing spec or test when changing behavior.
2. Implement the smallest change that makes tests pass.
3. Run local quality gates before pushing:
   - `bun run lint`
   - `bun run check-types`
   - `bun run test`
4. Run `bun run test:e2e` for routing/auth/checkout changes.

## Monorepo Rules

- Use `bun` as the package manager.
- Keep shared lint/type config in `packages/eslint-config` and `packages/typescript-config`.
- Keep E2E tests under `apps/web/tests/e2e`.

## Security and Secrets

- Never commit `.env.local` or any secret values.
- Use `apps/web/.env.example` to document required variables.
- Keep test artifacts (`playwright-report`, `test-results`, `auth.json`) out of git.

## Definition of Done

A change is complete only if:

1. Lint is clean with zero warnings.
2. Type checking passes.
3. Relevant tests pass.
4. Documentation/config is updated for any workflow change.
