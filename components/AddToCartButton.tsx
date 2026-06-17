"use client";
import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getDiscountAmount, getDiscountedPrice } from "@/lib/productPricing";

interface Props {
  product: Product;
  className?: string;
}

const WHATSAPP_NUMBER = "94762537608";

const formatPrice = (amount: number | undefined) =>
  new Number(amount).toLocaleString("en-LK", {
    currency: "LKR",
    style: "currency",
    minimumFractionDigits: 2,
  });

const getBuyLink = (product: Product) => {
  const discountAmount = getDiscountAmount(product?.price, product?.discount);
  const finalPrice = getDiscountedPrice(product?.price, product?.discount);
  const productUrl = product?.slug?.current
    ? `${window.location.origin}/product/${product.slug.current}`
    : window.location.href;
  const productDetails = [
    `Hi NUZII, I would like to buy this product: ${product?.name ?? "Product"}`,
    product?.variantInfo ? `Variant: ${product.variantInfo}` : null,
    product?.variant ? `Type: ${product.variant}` : null,
    discountAmount ? `Original price: ${formatPrice(product?.price)}` : null,
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

const AddToCartButton = ({ product, className }: Props) => {
  const isOutOfStock = product?.stock === 0;

  return (
    <div className="w-full h-12 flex items-center">
      <Button
        onClick={() => window.open(getBuyLink(product), "_blank", "noopener")}
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
