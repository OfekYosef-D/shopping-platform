import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductsGrid } from "../products-grid";

// Mock ProductCard to avoid next/image and server-action dependencies
vi.mock("../product-card", () => ({
  ProductCard: ({ name }: { name: string }) => (
    <div data-testid="product-card-mock">{name}</div>
  ),
}));

const mockProducts = [
  {
    id: "1",
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    priceInCents: 7999,
    imageUrl: null,
    category: "Electronics",
    description: "Premium wireless earbuds with noise cancellation",
  },
  {
    id: "2",
    name: "Classic T-Shirt",
    slug: "classic-tshirt",
    priceInCents: 2999,
    imageUrl: null,
    category: "Apparel",
    description: "Comfortable everyday organic cotton tee",
  },
  {
    id: "3",
    name: "Leather Wallet",
    slug: "leather-wallet",
    priceInCents: 4999,
    imageUrl: null,
    category: "Accessories",
    description: "Slim full-grain leather wallet with RFID blocking",
  },
];

describe("ProductsGrid", () => {
  it("should render the search input", () => {
    render(<ProductsGrid products={mockProducts} />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("should filter products by search text", () => {
    render(<ProductsGrid products={mockProducts} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "Earbuds" },
    });

    expect(screen.getByText("Wireless Earbuds")).toBeInTheDocument();
    expect(screen.queryByText("Classic T-Shirt")).not.toBeInTheDocument();
    expect(screen.queryByText("Leather Wallet")).not.toBeInTheDocument();
  });

  it("should show empty state when search yields no results", () => {
    render(<ProductsGrid products={mockProducts} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "xyz_no_match_at_all" },
    });

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByText("Wireless Earbuds")).not.toBeInTheDocument();
  });

  it("should apply both search and category filters together", () => {
    render(<ProductsGrid products={mockProducts} />);

    // Search for "leather" — matches Leather Wallet (Accessories)
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "leather" },
    });

    // Select Accessories category → Leather Wallet should be visible
    fireEvent.click(screen.getByRole("button", { name: "Accessories" }));
    expect(screen.getByText("Leather Wallet")).toBeInTheDocument();

    // Switch to Electronics → no leather items → empty state
    fireEvent.click(screen.getByRole("button", { name: "Electronics" }));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });
});
