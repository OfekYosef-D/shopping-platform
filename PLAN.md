# Shopping Platform – Detailed Bug-Fix & Improvement Plan

> Created by the Copilot coding agent on 2026-03-03.  
> This file gives future agent sessions the full context needed to
> continue work without re-reading every source file.

---

## 1. Stack & Repo Layout

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router only) |
| UI | React 19, Tailwind 4, Radix UI / shadcn |
| Database | Supabase PostgreSQL via Drizzle ORM |
| Auth | Supabase Auth + SSR cookies |
| State | Zustand (UI) + TanStack Query v5 (server state) |
| Payments | Stripe Checkout + webhook |
| Testing | Vitest (unit) + Playwright (E2E) |
| Package mgr | Bun (monorepo root + workspace `apps/web`) |

Monorepo structure:
```
shopping-platform/
  apps/web/                     # Next.js application
    src/
      actions/                  # Server actions (auth, cart, checkout)
      app/                      # Next.js routes
        (auth)/login|register
        (shop)/products|cart|checkout
        (dashboard)/
        api/cart|health|webhooks/stripe
      components/features/      # AddToCartButton, CartDrawer, …
      db/schema/                # Drizzle table definitions
      db/migrations/            # Raw SQL applied by run-migration.ts
      hooks/                    # useCartQuery, useDebounce
      stores/                   # Zustand ui-store
    tests/e2e/                  # Playwright tests
  packages/
    eslint-config/
    typescript-config/
    ui/                         # Shared UI primitives
```

---

## 2. How to Run Locally

```bash
# 1. Copy and fill in env vars
cp apps/web/.env.example apps/web/.env.local

# 2. Install deps
bun install

# 3. Apply DB migrations (idempotent)
bun run --cwd apps/web db:migrate

# 4. Seed products
bun run --cwd apps/web seed

# 5. Start dev server
bun run --cwd apps/web dev
```

Required environment variables (see `apps/web/.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### Quality gates (run before every push)

```bash
bun run lint          # ESLint – zero warnings
bun run check-types   # tsc --noEmit
bun run test          # Vitest unit tests
bun run test:e2e      # Playwright E2E (needs live Supabase + Stripe)
```

---

## 3. Known Bugs & Status

### BUG-1 · Guest cart merge missing after login  
**Status: FIXED in this PR**

**Root cause**: `auth.actions.ts → login()` calls
`supabase.auth.signInWithPassword()` then immediately redirects to
`/products`. It never reads the `guest_cart` cookie and never upserts
those items into the `cart_items` DB table. The guest's pending cart is
silently discarded.

**Fix applied**: After a successful sign-in, read the `guest_cart`
cookie, insert each item into `cart_items` (upsert: increment quantity
if the product is already in the DB cart), then clear the cookie.

File changed: `apps/web/src/actions/auth.actions.ts`

---

### BUG-2 · E2E test incorrectly expects guest redirect from `/cart`  
**Status: FIXED in this PR**

**Root cause**: `tests/e2e/user-journey.e2e.ts` contained:
```ts
test("should redirect unauthenticated users away from /cart", …)
await expect(page).toHaveURL(/\/login/);
```
But `app/(shop)/cart/page.tsx` explicitly supports guest carts via
the `guest_cart` cookie – it never redirects unauthenticated visitors.
The middleware (`middleware.ts`) only protects `/checkout` and
`/dashboard`.

**Fix applied**: Replaced that test with one that verifies a guest
visiting `/cart` sees the cart UI (either the empty state or their
cookie items), and is NOT redirected to login.

File changed: `apps/web/tests/e2e/user-journey.e2e.ts`

---

### BUG-3 · `any` type in cart page  
**Status: FIXED in this PR**

**Root cause**: `app/(shop)/cart/page.tsx` used `let items: any[] = []`
which suppresses type checking on the item objects.

**Fix applied**: Replaced with an explicit `CartItem` type alias that
matches the shape produced by both the guest-cookie and DB paths.

File changed: `apps/web/src/app/(shop)/cart/page.tsx`

---

### BUG-4 · `order_items` table may not exist (failed SQL insert)  
**Status: Migration exists – must be applied manually**

**Root cause**: The error `Failed query: insert into 'order_items'`
occurs when migration `0002_add_order_items.sql` has not been applied
to the database. The migration is idempotent (`CREATE TABLE IF NOT
EXISTS`) and safe to run at any time.

**Action needed**: Run `bun run --cwd apps/web db:migrate` against the
production / staging Supabase project. No code change required.

---

### BUG-5 · Guest checkout flow – no redirect back after login  
**Status: OPEN – future work**

**Root cause**: When a guest clicks "מעבר לתשלום" they are redirected
to `/login` by the middleware. After a successful login, `auth.actions.ts`
redirects to `/products` (hard-coded). The user has to manually navigate
back to `/cart` and click checkout again.

**Proposed fix**: Pass a `redirectTo=/checkout` query parameter in the
middleware redirect, read it in `login()`, and redirect there after
successful auth (with validation that it's a local path only).

This is a multi-step change that touches middleware, auth action, and
potentially the login UI component.

---

## 4. Architecture Notes

### Cart data flow

```
Guest user
  ├─ addToCart() → writes JSON to `guest_cart` cookie
  ├─ GET /api/cart → reads cookie → fetches product rows → returns merged items
  └─ Login → BUG-1 fix merges cookie into DB, clears cookie

Authenticated user
  ├─ addToCart() → upserts row in `cart_items` table
  └─ GET /api/cart → joins cart_items × products → returns rows
```

### Checkout flow

```
1. User visits /checkout
2. middleware.ts → redirects guest to /login
3. createCheckoutSession() (server action)
   a. Validate auth
   b. Load cart_items × products
   c. Validate stock for each item
   d. stripe.checkout.sessions.create(...)
   e. DB transaction: INSERT orders + INSERT order_items
   f. Return Stripe session URL
4. Page redirects user to Stripe-hosted payment page
5. Stripe fires POST /api/webhooks/stripe on payment completion
   a. Verify signature
   b. UPDATE orders SET status='paid'
   c. GREATEST(stock - quantity, 0) for each ordered product
   d. DELETE cart_items for the user
```

### DB Schema (Drizzle)

| Table | Key columns |
|---|---|
| `users` | `id` (uuid, PK = Supabase auth UID), `email`, `name` |
| `products` | `id`, `slug`, `priceInCents`, `stock` |
| `cart_items` | `id`, `userId` FK, `productId` FK, `quantity`; unique on (userId, productId) |
| `orders` | `id`, `userId`, `status` (enum), `totalInCents`, `stripeSessionId` (unique) |
| `order_items` | `id`, `orderId` FK, `productId` FK, `productName`, `priceInCents`, `quantity` |

---

## 5. Code Quality Observations

| File | Observation |
|---|---|
| `orders.ts` schema | `updatedAt` has `defaultNow()` but no DB trigger; it must be set manually in every UPDATE. The webhook does set it, but other future code may forget. |
| `cart/page.tsx` | `items: any[]` – fixed in this PR. |
| `checkout.actions.ts` | `session.url!` non-null assertion – safe because Stripe always returns a URL for mode="payment", but could be guarded. |
| `run-migration.ts` | Splits SQL on `;` which would break any SQL containing a semicolon inside a string literal or function body. For the current simple migrations this is fine. |

---

## 6. Testing Guide

### Unit tests (Vitest)

```bash
bun run --cwd apps/web test
```

Test files live next to their subject:
- `src/components/features/__specs__/add-to-cart-button.spec.tsx`
- `src/components/features/__specs__/cart-drawer.spec.tsx`
- `src/components/features/__specs__/product-card.spec.tsx`
- `src/components/features/__specs__/products-grid.spec.tsx`
- `src/app/(shop)/cart/__specs__/cart.spec.tsx`
- `src/app/(shop)/products/__specs__/products.spec.tsx`

### E2E tests (Playwright)

```bash
# Skipped unless env vars are set:
E2E_USER_EMAIL=test@example.com E2E_USER_PASSWORD=secret bun run --cwd apps/web test:e2e
```

E2E suites:
- `tests/e2e/page.e2e.ts` – Homepage smoke test
- `tests/e2e/products.e2e.ts` – Product listing / search
- `tests/e2e/user-journey.e2e.ts` – Full auth → cart → checkout flow
