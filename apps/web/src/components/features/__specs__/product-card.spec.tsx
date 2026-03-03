import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "../product-card";

// Mock the AddToCartButton since it's a Client Component
vi.mock("../add-to-cart-button", () => ({
  AddToCartButton: ({ productId }: { productId: string }) => (
    <button data-testid={`add-to-cart-${productId}`}>הוספה לסל</button>
  ),
}));

describe("ProductCard", () => {
  const defaultProps = {
    id: "prod-1",
    name: "Test Product",
    slug: "test-product",
    priceInCents: 1999,
    imageUrl: "/test-image.jpg",
  };

  it("should render product name and price", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    const price = screen.getByText((content) => content.includes("19.99"));
    expect(price.textContent).toContain("₪");
  });

  it("should link to correct product detail page", () => {
    render(<ProductCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/test-product");
  });

  it("should show placeholder when no image", () => {
    render(<ProductCard {...defaultProps} imageUrl={null} />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent("ללא תמונה");
  });

  it("should render the AddToCartButton", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByTestId("add-to-cart-prod-1")).toBeInTheDocument();
  });
});
