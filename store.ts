import { Product } from "./sanity.types";
import { getDiscountedPrice } from "./lib/productPricing";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SelectedVariant {
  _key?: string;
  color?: string;
  size?: string;
  sku?: string;
  priceOverride?: number;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: SelectedVariant;
}

export const getCartLineKey = (
  productId: string,
  selectedVariant?: SelectedVariant
) =>
  `${productId}::${selectedVariant?.color ?? ""}::${selectedVariant?.size ?? ""}`;

const lineKeyOf = (item: CartItem) =>
  getCartLineKey(item.product._id, item.selectedVariant);

const lineUnitPrice = (item: CartItem) => {
  const basePrice = item.selectedVariant?.priceOverride ?? item.product.price;
  return getDiscountedPrice(basePrice, item.product.discount);
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedVariant?: SelectedVariant, quantity?: number) => void;
  removeItem: (lineKey: string) => void;
  deleteCartProduct: (lineKey: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (lineKey: string) => number;
  getGroupedItems: () => CartItem[];
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedVariant, quantity = 1) =>
        set((state) => {
          const amount = Math.max(1, Math.floor(quantity));
          const key = getCartLineKey(product._id, selectedVariant);
          const existingItem = state.items.find(
            (item) => lineKeyOf(item) === key
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                lineKeyOf(item) === key
                  ? { ...item, quantity: item.quantity + amount }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                { product, quantity: amount, selectedVariant },
              ],
            };
          }
        }),
      removeItem: (lineKey) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (lineKeyOf(item) === lineKey) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (lineKey) =>
        set((state) => ({
          items: state.items.filter((item) => lineKeyOf(item) !== lineKey),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + lineUnitPrice(item) * item.quantity,
          0
        );
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice =
            item.selectedVariant?.priceOverride ?? item.product.price ?? 0;
          return total + basePrice * item.quantity;
        }, 0);
      },
      getItemCount: (lineKey) => {
        const item = get().items.find((item) => lineKeyOf(item) === lineKey);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
