"use client";

import { Product } from "@/sanity.types";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore, { SelectedVariant } from "@/store";
import { isProductOutOfStock } from "@/lib/productStock";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  product: Product;
  selectedVariant?: SelectedVariant;
  className?: string;
  quantity?: number;
  label?: string;
  showIcon?: boolean;
  /** When true (default) and the product has variants but none was passed in,
   * the control links to the product page instead of adding an ambiguous line. */
  requireSelection?: boolean;
}

const AddToBagButton = ({
  product,
  selectedVariant,
  className,
  quantity = 1,
  label,
  showIcon = true,
  requireSelection = true,
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const needsSelection = hasVariants && !selectedVariant;
  const content = (
    <>
      {showIcon && <ShoppingBag className="h-4 w-4" />}
      {label && <span>{label}</span>}
    </>
  );

  if (needsSelection && requireSelection) {
    return (
      <Link
        href={`/product/${product?.slug?.current}`}
        aria-label="Select options"
        title="Select options"
        className={cn(
          "flex items-center justify-center gap-2 border border-darkColor/30 text-darkColor/70 hover:bg-darkColor hover:text-white hoverEffect",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  const isOutOfStock =
    needsSelection || isProductOutOfStock(product, selectedVariant);

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(product, selectedVariant, quantity);
        toast.success(
          `${quantity} × ${product?.name ?? "Product"} added to cart`
        );
      }}
      aria-label={label ?? "Add to cart"}
      title={label ?? "Add to cart"}
      className={cn(
        "flex items-center justify-center gap-2 border border-darkColor/30 text-darkColor/70 hover:bg-darkColor hover:text-white hoverEffect disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {content}
    </button>
  );
};

export default AddToBagButton;
