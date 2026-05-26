import { create } from 'zustand';
import type { OrderItem } from '@/types';

type CartState = {
  userName: string;
  cart: OrderItem[];
  currentOrderId: string | null;

  setUserName: (name: string) => void;
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrentOrderId: (id: string | null) => void;
};

export const useStore = create<CartState>((set) => ({
  userName: '',
  cart: [],
  currentOrderId: null,

  setUserName: (name) => set({ userName: name }),

  addItem: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.itemId === item.itemId);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.itemId === item.itemId
              ? { ...c, quantity: c.quantity + item.quantity }
              : c
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.itemId !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((c) => c.itemId !== itemId)
          : state.cart.map((c) =>
              c.itemId === itemId ? { ...c, quantity } : c
            ),
    })),

  clearCart: () => set({ cart: [], currentOrderId: null }),

  setCurrentOrderId: (id) => set({ currentOrderId: id }),
}));
