import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ──────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────
vi.mock("@/stores/ui-store", () => ({
  useUIStore: vi.fn(),
}));

vi.mock("@/hooks/use-cart-query", () => ({
  useCartQuery: vi.fn(),
}));

vi.mock("@/actions/cart.actions", () => ({
  removeFromCart: vi.fn(),
  updateCartQuantity: vi.fn(),
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

import { CartDrawer } from "../cart-drawer";
import { useUIStore } from "@/stores/ui-store";
import { useCartQuery } from "@/hooks/use-cart-query";

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
const mockCloseCart = vi.fn();

function setStore(isCartOpen: boolean) {
  vi.mocked(useUIStore).mockReturnValue({
    isCartOpen,
    closeCart: mockCloseCart,
  } as never);
}

const MOCK_ITEMS = [
  {
    id: "ci-1",
    productId: "prod-1",
    name: "Widget Pro",
    slug: "widget-pro",
    priceInCents: 2999,
    imageUrl: null,
    quantity: 2,
  },
];

// ──────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────
describe("CartDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when isCartOpen is false", () => {
    setStore(false);
    vi.mocked(useCartQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    const { container } = render(<CartDrawer />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the drawer panel when isCartOpen is true", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: { items: MOCK_ITEMS, total: 5998 },
      isLoading: false,
    } as never);

    render(<CartDrawer />);

    expect(screen.getByTestId("cart-drawer")).toBeInTheDocument();
    expect(screen.getByText("Your Cart")).toBeInTheDocument();
  });

  it("shows cart items when data is loaded", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: { items: MOCK_ITEMS, total: 5998 },
      isLoading: false,
    } as never);

    render(<CartDrawer />);

    expect(screen.getByText("Widget Pro")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-quantity")).toHaveTextContent("2");
  });

  it("shows the empty state when the cart has no items", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    } as never);

    render(<CartDrawer />);

    expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    render(<CartDrawer />);

    expect(screen.getByTestId("cart-loading")).toBeInTheDocument();
  });

  it("calls closeCart when the overlay is clicked", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    } as never);

    render(<CartDrawer />);
    fireEvent.click(screen.getByTestId("cart-overlay"));

    expect(mockCloseCart).toHaveBeenCalledOnce();
  });

  it("calls closeCart when the close button is clicked", () => {
    setStore(true);
    vi.mocked(useCartQuery).mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    } as never);

    render(<CartDrawer />);
    fireEvent.click(screen.getByTestId("cart-close"));

    expect(mockCloseCart).toHaveBeenCalledOnce();
  });
});
