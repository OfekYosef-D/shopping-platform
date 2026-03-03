import "@testing-library/jest-dom";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";
process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/shopping_platform";
process.env.STRIPE_SECRET_KEY ??= "sk_test_placeholder";
process.env.STRIPE_WEBHOOK_SECRET ??= "whsec_placeholder";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { fill, blurDataURL, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-fill={fill ? "true" : undefined} data-blurdataurl={blurDataURL} {...rest} />;
  },
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));
