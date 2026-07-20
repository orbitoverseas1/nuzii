"use client";

import { Product, ProductVariant } from "@/sanity.types";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type Variant = ProductVariant & { _key: string };

interface Props {
  product: Product;
  onChange: (variant: Variant | null) => void;
}

const ProductVariantSelector = ({ product, onChange }: Props) => {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const colors = useMemo(
    () =>
      Array.from(
        new Set(variants.map((v) => v.color).filter(Boolean))
      ) as string[],
    [variants]
  );
  const hasColors = colors.length > 0;
  const hasSizes = variants.some((v) => v.size);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    hasColors ? colors[0] : undefined
  );

  const sizesForColor = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .filter((v) => (hasColors ? v.color === selectedColor : true))
            .map((v) => v.size)
            .filter(Boolean)
        )
      ) as string[],
    [variants, selectedColor, hasColors]
  );

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    hasSizes ? sizesForColor[0] : undefined
  );

  useEffect(() => {
    if (hasSizes && selectedSize && !sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizesForColor]);

  const selectedVariant = useMemo(() => {
    return (
      (variants.find(
        (v) =>
          (!hasColors || v.color === selectedColor) &&
          (!hasSizes || v.size === selectedSize)
      ) as Variant | undefined) ?? null
    );
  }, [variants, selectedColor, selectedSize, hasColors, hasSizes]);

  useEffect(() => {
    onChange(selectedVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant]);

  if (!variants.length) return null;

  return (
    <div className="space-y-4">
      {hasColors && (
        <div>
          <p className="text-sm font-semibold mb-2">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const swatch = variants.find((v) => v.color === color)?.colorHex;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  className={cn(
                    "w-9 h-9 rounded-full border-2 flex items-center justify-center hoverEffect",
                    selectedColor === color
                      ? "border-darkColor"
                      : "border-darkColor/20"
                  )}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: swatch || "#e5e5e5" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasSizes && (
        <div>
          <p className="text-sm font-semibold mb-2">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 rounded-md border text-sm font-medium hoverEffect",
                  selectedSize === size
                    ? "border-darkColor bg-darkColor text-white"
                    : "border-darkColor/30 text-darkColor"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedVariant ? (
        (selectedVariant.stock ?? 0) <= 0 && (
          <p className="text-sm text-red-600 font-medium">
            Out of stock in this option
          </p>
        )
      ) : (
        <p className="text-sm text-red-600 font-medium">
          This combination isn&apos;t available
        </p>
      )}
    </div>
  );
};

export default ProductVariantSelector;
