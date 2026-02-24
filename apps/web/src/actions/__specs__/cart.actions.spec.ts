import { describe, it, expect, vi, beforeEach } from "vitest";
import { addToCart, removeFromCart, updateCartQuantity } from "../cart.actions";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

// Mock the db
vi.mock("@/db", () => ({
  db: {
    query: {
      cartItems: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

// Mock Supabase — always returns an authenticated user
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      }),
    },
  }),
}));

describe("Cart Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a new item to cart", async () => {
    // Arrange
    vi.mocked(db.query.cartItems.findFirst).mockResolvedValueOnce(undefined);
    const insertValuesMock = vi.fn();
    vi.mocked(db.insert).mockReturnValueOnce({ values: insertValuesMock } as unknown as ReturnType<typeof db.insert>);

    // Act
    const result = await addToCart("prod-1", 1, null, new FormData());

    // Assert
    expect(db.query.cartItems.findFirst).toHaveBeenCalled();
    expect(db.insert).toHaveBeenCalled();
    expect(insertValuesMock).toHaveBeenCalledWith({ userId: "user-1", productId: "prod-1", quantity: 1 });
    expect(revalidatePath).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({ success: true, message: "Added to cart" });
  });

  it("should increment quantity for existing cart item", async () => {
    // Arrange
    vi.mocked(db.query.cartItems.findFirst).mockResolvedValueOnce({
      id: "cart-item-1",
      userId: "user-1",
      productId: "prod-1",
      quantity: 2,
      createdAt: new Date(),
    });
    const updateWhereMock = vi.fn();
    const updateSetMock = vi.fn(() => ({ where: updateWhereMock }));
    vi.mocked(db.update).mockReturnValueOnce({ set: updateSetMock } as unknown as ReturnType<typeof db.update>);

    // Act
    const result = await addToCart("prod-1", 1, null, new FormData());

    // Assert
    expect(db.update).toHaveBeenCalled();
    expect(updateSetMock).toHaveBeenCalledWith({ quantity: 3 });
    expect(revalidatePath).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({ success: true, message: "Cart updated" });
  });

  it("should remove item from cart", async () => {
    // Arrange
    const deleteWhereMock = vi.fn();
    vi.mocked(db.delete).mockReturnValueOnce({ where: deleteWhereMock } as unknown as ReturnType<typeof db.delete>);

    // Act
    const result = await removeFromCart("prod-1", new FormData());

    // Assert
    expect(db.delete).toHaveBeenCalled();
    expect(deleteWhereMock).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({ success: true, message: "Removed from cart" });
  });

  it("should update quantity and remove when quantity <= 0", async () => {
    // Arrange
    const deleteWhereMock = vi.fn();
    vi.mocked(db.delete).mockReturnValueOnce({ where: deleteWhereMock } as unknown as ReturnType<typeof db.delete>);

    // Act
    const result = await updateCartQuantity("item-1", 0, new FormData());

    // Assert
    expect(db.delete).toHaveBeenCalled();
    expect(deleteWhereMock).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({ success: true, message: "Item removed" });
  });
});
