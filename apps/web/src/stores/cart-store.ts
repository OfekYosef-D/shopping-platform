import { create } from "zustand";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imageUrl: string | null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setItems: (items: CartItem[]) => void;
  optimisticAdd: (item: CartItem) => void;
  optimisticRemove: (productId: string) => void;
  optimisticUpdateQty: (productId: string, quantity: number) => void;
  totalItems: () => number;
  totalPriceInCents: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setItems: (items) => set({ items }),
  optimisticAdd: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...s.items, item] };
    }),
  optimisticRemove: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
  optimisticUpdateQty: (productId, quantity) =>
    set((s) => ({
      items: quantity <= 0
        ? s.items.filter((i) => i.productId !== productId)
        : s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    })),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPriceInCents: () =>
    get().items.reduce((sum, i) => sum + i.priceInCents * i.quantity, 0),
}));
