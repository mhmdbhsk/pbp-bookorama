import { Books } from '@prisma/client';
import { create } from 'zustand';

interface CartState {
  cart: Books[];
  addToCart: (book: Books) => void;
  removeFromCart: (book: Books) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()((set) => ({
  cart: [],
  addToCart: (book: Books) => set((state) => ({ cart: [...state.cart, book] })),
  removeFromCart: (book: Books) =>
    set((state) => ({ cart: state.cart.filter((b) => b.isbn !== book.isbn) })),
  clearCart: () => set({ cart: [] }),
}));
