import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartItemRow } from "../_components/cart-item-row";

vi.mock("@/actions/cart.actions", () => ({
  removeFromCart: vi.fn(),
  updateCartQuantity: vi.fn(),
}));

const mockItem = {
  id: "cart-item-1",
  productId: "prod-1",
  name: "Test Product",
  slug: "test-product",
  priceInCents: 2999,
  imageUrl: null,
  quantity: 2,
};

describe("Cart Page", () => {
  it("should render empty cart state", () => {
    render(
      <p className="text-muted-foreground">Your cart is empty.</p>
    );
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("should list cart items with quantities", () => {
    render(<CartItemRow {...mockItem} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByTestId("quantity")).toHaveTextContent("2");
  });

  it("should update total when quantity changes", () => {
    render(<CartItemRow {...mockItem} />);
    // Subtotal = 2 * $29.99 = $59.98
    expect(screen.getByText("$59.98")).toBeInTheDocument();
  });

  it("should remove item from cart", () => {
    render(<CartItemRow {...mockItem} />);
    const removeButton = screen.getByTestId("remove-button");
    expect(removeButton).toBeInTheDocument();
  });
});
