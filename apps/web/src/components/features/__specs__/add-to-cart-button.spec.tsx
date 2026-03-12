import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/actions/cart.actions", () => ({
  addToCart: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

import { AddToCartButton } from "../add-to-cart-button";
import { useActionState } from "react";

const mockFormAction = vi.fn();

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "" },
      mockFormAction,
      false,
    ]);
  });

  it("renders Add to Cart button in idle state", () => {
    render(<AddToCartButton productId="prod-1" />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("disables button and shows spinner while request is pending", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "" },
      mockFormAction,
      true,
    ]);

    render(<AddToCartButton productId="prod-1" />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("shows inline error text when action returns a failure message", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: false, message: "Please sign in to add items to cart" },
      mockFormAction,
      false,
    ]);

    render(<AddToCartButton productId="prod-1" />);

    expect(
      screen.getByText("Please sign in to add items to cart"),
    ).toBeInTheDocument();
  });

  it("does not render failure message when action succeeds", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: true, message: "Added to cart" },
      mockFormAction,
      false,
    ]);

    render(<AddToCartButton productId="prod-1" />);

    expect(screen.queryByText("Added to cart")).not.toBeInTheDocument();
  });
});
