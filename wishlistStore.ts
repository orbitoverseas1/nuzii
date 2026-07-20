import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item._id === product._id);
          return {
            items: exists
              ? state.items.filter((item) => item._id !== product._id)
              : [...state.items, product],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      isWishlisted: (productId) =>
        get().items.some((item) => item._id === productId),
    }),
    { name: "wishlist-store" }
  )
);

export default useWishlistStore;
