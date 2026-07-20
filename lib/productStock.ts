import { Product } from "@/sanity.types";

type StockableProduct = Pick<Product, "stock" | "variants">;

interface VariantStock {
  stock?: number;
}

export const getAvailableStock = (
  product: StockableProduct,
  selectedVariant?: VariantStock
) => {
  if (selectedVariant) return selectedVariant.stock ?? 0;
  if (product.variants?.length) {
    return product.variants.reduce((total, v) => total + (v.stock ?? 0), 0);
  }
  return product.stock ?? 0;
};

export const isProductOutOfStock = (
  product: StockableProduct,
  selectedVariant?: VariantStock
) => getAvailableStock(product, selectedVariant) <= 0;
