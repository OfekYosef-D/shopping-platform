import { describe, it, expect, vi, beforeEach } from "vitest";

// ──────────────────────────────────────────────────────────
// Hoisted mocks — available in vi.mock factories AND tests
// ──────────────────────────────────────────────────────────
const { mockSessionsCreate, mockTransaction } = vi.hoisted(() => ({
  mockSessionsCreate: vi.fn(),
  mockTransaction: vi.fn(),
}));

// Stripe constructor is called at module-load time in checkout.actions.ts,
// so the mock must be in place before the module is imported.
// Must use a regular function (not arrow) so `new Stripe()` works as a constructor.
vi.mock("stripe", () => ({
  default: vi.fn(function () {
    return { checkout: { sessions: { create: mockSessionsCreate } } };
  }),
}));

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(),
    transaction: mockTransaction,
  },
}));

vi.mock("@/db/schema", () => ({
  cartItems: {},
  products: {},
  orders: {},
  orderItems: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createCheckoutSession } from "../checkout.actions";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function makeMockSupabase(user: { id: string } | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
  };
}

function makeSelectChain(items: unknown[]) {
  return {
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(items),
  };
}

const MOCK_CART_ITEMS = [
  {
    id: "ci-1",
    quantity: 2,
    productId: "prod-1",
    name: "Widget Pro",
    priceInCents: 2999,
    imageUrl: null,
    stock: 10,
  },
  {
    id: "ci-2",
    quantity: 1,
    productId: "prod-2",
    name: "Gadget Plus",
    priceInCents: 4999,
    imageUrl: "https://example.com/gadget.jpg",
    stock: 5,
  },
];

// ──────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────
describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws Unauthorized when no user is authenticated", async () => {
    vi.mocked(createClient).mockResolvedValue(makeMockSupabase(null) as never);

    await expect(createCheckoutSession()).rejects.toThrow("Unauthorized");
  });

  it("throws when the cart is empty", async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeMockSupabase({ id: "user-1" }) as never
    );
    vi.mocked(db.select).mockReturnValue(makeSelectChain([]) as never);

    await expect(createCheckoutSession()).rejects.toThrow("Your cart is empty.");
  });

  it("throws when a cart item exceeds available stock", async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeMockSupabase({ id: "user-1" }) as never
    );
    const lowStockItems = [{ ...MOCK_CART_ITEMS[0], stock: 1, quantity: 5 }];
    vi.mocked(db.select).mockReturnValue(makeSelectChain(lowStockItems) as never);

    await expect(createCheckoutSession()).rejects.toThrow(/only has 1 units available/);
  });

  it("creates a Stripe checkout session with correct line items and metadata", async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeMockSupabase({ id: "user-1" }) as never
    );
    vi.mocked(db.select).mockReturnValue(makeSelectChain(MOCK_CART_ITEMS) as never);
    mockSessionsCreate.mockResolvedValue({
      id: "cs_test_abc123",
      url: "https://checkout.stripe.com/pay/cs_test_abc123",
    });
    mockTransaction.mockResolvedValue(undefined);

    const url = await createCheckoutSession();

    expect(mockSessionsCreate).toHaveBeenCalledOnce();
    expect(mockSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        metadata: { userId: "user-1" },
        line_items: expect.arrayContaining([
          expect.objectContaining({
            quantity: 2,
            price_data: expect.objectContaining({ unit_amount: 2999 }),
          }),
          expect.objectContaining({
            quantity: 1,
            price_data: expect.objectContaining({ unit_amount: 4999 }),
          }),
        ]),
      })
    );
    expect(url).toBe("https://checkout.stripe.com/pay/cs_test_abc123");
  });

  it("persists the order in a transaction on the happy path", async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeMockSupabase({ id: "user-1" }) as never
    );
    vi.mocked(db.select).mockReturnValue(makeSelectChain(MOCK_CART_ITEMS) as never);
    mockSessionsCreate.mockResolvedValue({
      id: "cs_test_abc123",
      url: "https://checkout.stripe.com/pay/cs_test_abc123",
    });
    mockTransaction.mockResolvedValue(undefined);

    await createCheckoutSession();

    expect(mockTransaction).toHaveBeenCalledOnce();
  });

  it("calls stripe before committing the DB transaction", async () => {
    const callOrder: string[] = [];

    vi.mocked(createClient).mockResolvedValue(
      makeMockSupabase({ id: "user-1" }) as never
    );
    vi.mocked(db.select).mockReturnValue(makeSelectChain(MOCK_CART_ITEMS) as never);
    mockSessionsCreate.mockImplementation(async () => {
      callOrder.push("stripe");
      return { id: "cs_test_xyz", url: "https://checkout.stripe.com/pay/cs_test_xyz" };
    });
    mockTransaction.mockImplementation(async () => {
      callOrder.push("transaction");
    });

    await createCheckoutSession();

    // Stripe session must be created first so we have the session ID to store
    expect(callOrder).toEqual(["stripe", "transaction"]);
  });
});
