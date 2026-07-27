"use client";

import { Product, ProductVariant } from "@/sanity.types";
import { useMemo, useState } from "react";
import BuyNowButton from "@/components/BuyNowButton";
import AddToBagButton from "@/components/AddToBagButton";
import WishlistButton from "@/components/WishlistButton";
import PriceView from "@/components/PriceView";
import ProductVariantSelector from "./ProductVariantSelector";
import { Minus, Plus } from "lucide-react";

type Variant = ProductVariant & { _key: string };

const ProductPurchasePanel = ({ product }: { product: Product }) => {
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const stockLimit = useMemo(
    () =>
      hasVariants
        ? selectedVariant?.stock
        : product.stock,
    [hasVariants, product.stock, selectedVariant]
  );
  const canIncrease = stockLimit == null || quantity < stockLimit;

  return (
    <div className="flex flex-col gap-6">
      <PriceView
        price={selectedVariant?.priceOverride ?? product.price}
        discount={product.discount}
        className="text-lg font-normal text-nuziiText"
      />

      {hasVariants && (
        <ProductVariantSelector
          product={product}
          onChange={(variant) => {
            setSelectedVariant(variant);
            setQuantity(1);
          }}
        />
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-nuziiText">Quantity</p>
        <div className="inline-flex h-12 items-center border border-nuziiText/30">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-full w-12 items-center justify-center text-nuziiText transition-colors hover:bg-nuziiCream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-12 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => {
              if (canIncrease) setQuantity((current) => current + 1);
            }}
            disabled={!canIncrease}
            aria-label="Increase quantity"
            className="flex h-full w-12 items-center justify-center text-nuziiText transition-colors hover:bg-nuziiCream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-stretch gap-3">
          <AddToBagButton
            product={product}
            selectedVariant={selectedVariant ?? undefined}
            requireSelection={false}
            quantity={quantity}
            label="Add to cart"
            showIcon={false}
            className="h-12 flex-1 border-nuziiRoseGoldDark text-sm font-medium tracking-wide text-nuziiText"
          />
          <WishlistButton
            product={product}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-nuziiText/30 text-nuziiText transition-colors hover:border-nuziiRoseGoldDark"
          />
        </div>
        <BuyNowButton
          product={product}
          selectedVariant={selectedVariant ?? undefined}
          requireSelection={false}
          quantity={quantity}
          className="h-12 rounded-none border-nuziiRoseGoldDark bg-nuziiRoseGoldDark text-white hover:bg-nuziiText"
        />
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
