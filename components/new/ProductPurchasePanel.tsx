"use client";

import { Product, ProductVariant } from "@/sanity.types";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import AddToBagButton from "@/components/AddToBagButton";
import WishlistButton from "@/components/WishlistButton";
import PriceView from "@/components/PriceView";
import ProductVariantSelector from "./ProductVariantSelector";

type Variant = ProductVariant & { _key: string };

const ProductPurchasePanel = ({ product }: { product: Product }) => {
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  return (
    <div className="flex flex-col gap-5">
      {hasVariants && (
        <>
          <PriceView
            price={selectedVariant?.priceOverride ?? product.price}
            discount={product.discount}
            className="text-lg font-bold"
          />
          <ProductVariantSelector
            product={product}
            onChange={setSelectedVariant}
          />
        </>
      )}
      <div className="flex items-center gap-2.5 lg:gap-5">
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant ?? undefined}
          className="bg-darkColor/80 text-white hover:bg-darkColor hoverEffect"
        />
        <AddToBagButton
          product={product}
          selectedVariant={selectedVariant ?? undefined}
          requireSelection={false}
          className="w-12 h-12 shrink-0 border-2"
        />
        <WishlistButton
          product={product}
          className="border-2 border-darkColor/30 text-darkColor/60 px-2.5 py-1.5 rounded-md hover:text-darkColor hover:border-darkColor hoverEffect"
        />
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
