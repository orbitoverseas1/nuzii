"use client";

import { Product } from "@/sanity.types";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { isProductOutOfStock } from "@/lib/productStock";
import useCartStore, { SelectedVariant } from "@/store";

interface Props {
  product: Product;
  selectedVariant?: SelectedVariant;
  className?: string;
  quantity?: number;
  /** When true (default) and the product has variants but none was passed in,
   * the button links to the product page instead of adding an ambiguous line.
   * Set false when rendering inside a variant selector that already resolves a
   * default selection (e.g. the product page itself). */
  requireSelection?: boolean;
  /** Runs before navigating — used to close overlays that would otherwise stay
   * mounted across the route change. */
  onBeforeNavigate?: () => void;
}

/**
 * Adds the item to the cart and goes straight to checkout.
 *
 * Sits alongside AddToBagButton, which adds the same line but keeps the
 * customer on the page.
 */
const BuyNowButton = ({
  product,
  selectedVariant,
  className,
  quantity = 1,
  requireSelection = true,
  onBeforeNavigate,
}: Props) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [navigating, setNavigating] = useState(false);
  const navigatingRef = useRef(false);

  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const needsSelection = hasVariants && !selectedVariant;

  // Never send someone to checkout with an unspecified variant — they'd be
  // paying for an item nobody can pick off a shelf.
  if (needsSelection && requireSelection) {
    return (
      <div className="flex-1 h-12 flex items-center">
        <Link
          href={`/product/${product?.slug?.current}`}
          onClick={onBeforeNavigate}
          className={cn(
            "w-full h-9 px-4 inline-flex items-center justify-center rounded-md bg-transparent text-darkColor shadow-none border border-darkColor/30 text-sm font-semibold tracking-wide hover:bg-darkColor hover:text-white hoverEffect",
            className
          )}
        >
          Select Options
        </Link>
      </div>
    );
  }

  const isOutOfStock = isProductOutOfStock(product, selectedVariant);

  const handleClick = (e: React.MouseEvent) => {
    // Product cards wrap the image in a Link — don't let this bubble into it.
    e.preventDefault();
    e.stopPropagation();

    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setNavigating(true);

    onBeforeNavigate?.();
    addItem(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  return (
    <div className="flex-1 h-12 flex items-center">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isOutOfStock || navigating}
        className={cn(
          "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:text-white cursor-pointer hoverEffect",
          className
        )}
      >
        {isOutOfStock ? "Out of Stock" : "Buy Now"}
      </Button>
    </div>
  );
};

export default BuyNowButton;
