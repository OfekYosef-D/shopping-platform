import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ──────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────
vi.mock("@/actions/cart.actions", () => ({
  addToCart: vi.fn(),
}));

// Control useActionState and useOptimistic so we can simulate
// pending, error, and success states without running React internals.
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
    useOptimistic: vi.fn(),
  };
});

// Stub out the TanStack Query client — the component calls useQueryClient()
// to invalidate the cart cache after a successful add, but we don't need to
// test that integration here.
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

import { AddToCartButton } from "../add-to-cart-button";
import { useActionState, useOptimistic } from "react";

// ──────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────
const mockFormAction = vi.fn();

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default idle state: not pending, no message
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "" },
      mockFormAction,
      false,
    ]);
    vi.mocked(useOptimistic).mockReturnValue([{ isAdding: false }, vi.fn()]);
  });

  it("renders 'Add to Cart' button in the idle state", () => {
    render(<AddToCartButton productId="prod-1" />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("disables button and shows spinner when isPending is true", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "" },
      mockFormAction,
      true, // isPending
    ]);

    render(<AddToCartButton productId="prod-1" />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("disables button and shows spinner when optimistic isAdding is true", () => {
    vi.mocked(useOptimistic).mockReturnValue([{ isAdding: true }, vi.fn()]);

    render(<AddToCartButton productId="prod-1" />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("shows error message when state.success is false and message is set", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "Please sign in to add items to cart" },
      mockFormAction,
      false,
    ]);

    render(<AddToCartButton productId="prod-1" />);

    expect(
      screen.getByText("Please sign in to add items to cart")
    ).toBeInTheDocument();
  });

  it("does not render error paragraph when state.success is true", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: true, message: "Cart updated" },
      mockFormAction,
      false,
    ]);

    render(<AddToCartButton productId="prod-1" />);

    // The message is only shown when success === false
    expect(screen.queryByText("Cart updated")).not.toBeInTheDocument();
  });
});
