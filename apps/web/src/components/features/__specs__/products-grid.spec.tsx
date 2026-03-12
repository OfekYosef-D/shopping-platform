import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductsGrid } from "../products-grid";

vi.mock("../product-card", () => ({
  ProductCard: ({ name }: { name: string }) => (
    <div data-testid="product-card-mock">{name}</div>
  ),
}));

const mockProducts = [
  {
    id: "1",
    name: "כרית ויסקו",
    slug: "memory-pillow",
    priceInCents: 19900,
    imageUrl: null,
    category: "כריות",
    description: "כרית ויסקו נוחה במיוחד",
  },
  {
    id: "2",
    name: "מזרן היברידי",
    slug: "hybrid-mattress",
    priceInCents: 219900,
    imageUrl: null,
    category: "מזרנים",
    description: "מזרן היברידי עם תמיכה מלאה",
  },
  {
    id: "3",
    name: "טופר ויסקו",
    slug: "memory-topper",
    priceInCents: 89900,
    imageUrl: null,
    category: "אביזרי שינה",
    description: "טופר לשדרוג מיידי של המזרן",
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
      target: { value: "ויסקו" },
    });

    expect(screen.getByText("כרית ויסקו")).toBeInTheDocument();
    expect(screen.getByText("טופר ויסקו")).toBeInTheDocument();
    expect(screen.queryByText("מזרן היברידי")).not.toBeInTheDocument();
  });

  it("should show empty state when search yields no results", () => {
    render(<ProductsGrid products={mockProducts} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "xyz_no_match_at_all" },
    });

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByText("כרית ויסקו")).not.toBeInTheDocument();
  });

  it("should apply both search and category filters together", () => {
    render(<ProductsGrid products={mockProducts} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "ויסקו" },
    });

    fireEvent.click(screen.getByRole("button", { name: "כריות" }));
    expect(screen.getByText("כרית ויסקו")).toBeInTheDocument();
    expect(screen.queryByText("טופר ויסקו")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "מזרנים" }));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });
});
