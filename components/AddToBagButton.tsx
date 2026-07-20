"use client";
import { Product } from "@/sanity.types";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore, { SelectedVariant } from "@/store";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  product: Product;
  selectedVariant?: SelectedVariant;
  className?: string;
  /** When true (default) and the product has variants but none was passed in,
   * the button links to the product page instead of adding an ambiguous line.
   * Set false when rendering inside a variant selector that already resolves a
   * default selection (e.g. the product page itself). */
  requireSelection?: boolean;
}

const AddToBagButton = ({
  product,
  selectedVariant,
  className,
  requireSelection = true,
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const needsSelection = hasVariants && !selectedVariant;

  if (needsSelection && requireSelection) {
    return (
      <Link
        href={`/product/${product?.slug?.current}`}
        aria-label="Select options"
        title="Select options"
        className={cn(
          "flex items-center justify-center border border-darkColor/30 rounded-md text-darkColor/70 hover:text-white hover:bg-darkColor hoverEffect",
          className
        )}
      >
        <ShoppingBag className="w-4 h-4" />
      </Link>
    );
  }

  const isOutOfStock = needsSelection
    ? true
    : selectedVariant
      ? (selectedVariant.stock ?? 0) <= 0
      : product?.stock === 0;

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, selectedVariant);
        toast.success(`${product?.name ?? "Product"} added to cart`);
      }}
      aria-label="Add to cart"
      title="Add to cart"
      className={cn(
        "flex items-center justify-center border border-darkColor/30 rounded-md text-darkColor/70 hover:text-white hover:bg-darkColor hoverEffect disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
    >
      <ShoppingBag className="w-4 h-4" />
    </button>
  );
};

export default AddToBagButton;
