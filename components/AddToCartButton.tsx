"use client";
import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getDiscountAmount, getDiscountedPrice } from "@/lib/productPricing";
import { isProductOutOfStock } from "@/lib/productStock";
import { SelectedVariant } from "@/store";

interface Props {
  product: Product;
  selectedVariant?: SelectedVariant;
  className?: string;
}

const WHATSAPP_NUMBER = "94762537608";

const formatPrice = (amount: number | undefined) =>
  new Number(amount).toLocaleString("en-LK", {
    currency: "LKR",
    style: "currency",
    minimumFractionDigits: 2,
  });

const getBuyLink = (product: Product, selectedVariant?: SelectedVariant) => {
  const price = selectedVariant?.priceOverride ?? product?.price;
  const discountAmount = getDiscountAmount(price, product?.discount);
  const finalPrice = getDiscountedPrice(price, product?.discount);
  const productUrl = product?.slug?.current
    ? `${window.location.origin}/product/${product.slug.current}`
    : window.location.href;
  const productDetails = [
    `Hi NUZII, I would like to buy this product: ${product?.name ?? "Product"}`,
    selectedVariant?.color ? `Color: ${selectedVariant.color}` : null,
    selectedVariant?.size ? `Size: ${selectedVariant.size}` : null,
    product?.variantInfo ? `Variant: ${product.variantInfo}` : null,
    discountAmount ? `Original price: ${formatPrice(price)}` : null,
    discountAmount ? `Discount: ${formatPrice(discountAmount)}` : null,
    `Price: ${formatPrice(finalPrice)}`,
    `Product link: ${productUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    productDetails
  )}`;
};

const AddToCartButton = ({ product, selectedVariant, className }: Props) => {
  const isOutOfStock = isProductOutOfStock(product, selectedVariant);

  return (
    <div className="flex-1 h-12 flex items-center">
      <Button
        onClick={() =>
          window.open(getBuyLink(product, selectedVariant), "_blank", "noopener")
        }
        disabled={isOutOfStock}
        className={cn(
          "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:text-white cursor-pointer hoverEffect",
          className
        )}
      >
        Buy
      </Button>
    </div>
  );
};

export default AddToCartButton;
