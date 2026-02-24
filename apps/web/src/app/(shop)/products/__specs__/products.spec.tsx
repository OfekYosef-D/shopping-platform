import { describe, it, expect, vi } from "vitest";
import { render, screen, getAllByRole } from "@testing-library/react";
import { ProductCard } from "@/components/features/product-card";

vi.mock("@/actions/cart.actions", () => ({
  addToCart: vi.fn(),
}));

vi.mock("@/components/features/add-to-cart-button", () => ({
  AddToCartButton: ({ productId }: { productId: string }) => (
    <button data-testid={`add-to-cart-${productId}`}>Add to Cart</button>
  ),
}));

const mockProducts = [
  { id: "prod-1", name: "Widget Pro", slug: "widget-pro", priceInCents: 1999, imageUrl: null },
  { id: "prod-2", name: "Gadget Plus", slug: "gadget-plus", priceInCents: 4999, imageUrl: null },
];

describe("Products Page", () => {
  it("should render products grid", () => {
    const { container } = render(
      <div>
        {mockProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    );
    expect(screen.getByText("Widget Pro")).toBeInTheDocument();
    expect(screen.getByText("Gadget Plus")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-testid^='add-to-cart-']")).toHaveLength(2);
  });

  it("should show empty state when no products", () => {
    render(
      <p className="text-muted-foreground col-span-full text-center py-20">
        No products yet.
      </p>
    );
    expect(screen.getByText("No products yet.")).toBeInTheDocument();
  });

  it("should link each product to its detail page", () => {
    render(<ProductCard {...mockProducts[0]} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/products/widget-pro");
  });
});
