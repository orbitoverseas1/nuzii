import { CartItem } from "@/store";

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}
