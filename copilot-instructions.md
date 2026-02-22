# Premium E-Commerce AI Assistant Skills & Best Practices

## Tech Stack Rules
- Use **Next.js 16.1.6** App Router exclusively. No Pages router.
- Use **React 19** hooks (`useActionState`, `useFormStatus`, `useOptimistic`).
- Database: Use **Drizzle ORM** with Supabase PostgreSQL. Never use Prisma.
- UI: Prefer **Aceternity UI** or custom **Tailwind 4** for Apple-like Glassmorphism.
- Styling: Use `backdrop-blur`, subtle borders (`border-white/20`), and sleek shadows. Font: Inter or system-ui (Apple San Francisco).
- State: Use **Zustand** for client-side (cart) and **TanStack Query v5** for server-state caching.

## SDD (Spec-Driven Development) Workflow
1. ALWAYS write the Spec/Test (using SpecKit/Vitest/Playwright) BEFORE writing the implementation.
2. Ensure edge cases (empty states, loading, errors) are defined in the specs.

## Architecture & Performance
- Strictly separate Server Components (fetch data) from Client Components (interactivity).
- Use Server Actions for all mutations (cart add, checkout, login).
- Ensure "Zero Layout Shift" (CLS = 0) by using proper image dimensions and loading skeletons.