"use client";

import { Product } from "@/sanity.types";
import { isProductOutOfStock } from "@/lib/productStock";
import useCartStore from "@/store";
import Link from "next/link";
import toast from "react-hot-toast";

const actionClassName =
  "relative z-10 flex min-h-11 w-full items-center justify-center border border-nuziiRoseGoldDark bg-transparent px-4 py-2 text-sm font-medium tracking-wide text-nuziiText transition-colors duration-300 hover:bg-nuziiRoseGoldDark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuziiRoseGoldDark focus-visible:ring-offset-2";

const ProductCardAction = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = isProductOutOfStock(product);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  if (isOutOfStock) {
    return (
      <button
        type="button"
        disabled
        className={`${actionClassName} cursor-not-allowed border-nuziiTextLight/30 text-nuziiTextLight`}
      >
        Sold out
      </button>
    );
  }

  if (hasVariants) {
    return (
      <Link
        href={`/product/${product.slug?.current}`}
        className={actionClassName}
      >
        Choose options
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={actionClassName}
      onClick={() => {
        addItem(product);
        toast.success(`${product.name ?? "Product"} added to cart`);
      }}
    >
      Add to cart
    </button>
  );
};

export default ProductCardAction;
