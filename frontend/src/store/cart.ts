import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variant_id === item.variant_id);
        if (existing) {
          set({ items: items.map((i) => i.variant_id === item.variant_id ? { ...i, quantity: i.quantity + item.quantity } : i) });
        } else {
          set({ items: [...items, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return; }
        set({ items: get().items.map((i) => i.id === id ? { ...i, quantity: qty } : i) });
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "beauty-cart" }
  )
);
