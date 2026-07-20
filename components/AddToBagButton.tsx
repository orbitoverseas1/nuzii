"use client";
import { Product } from "@/sanity.types";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/store";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const AddToBagButton = ({ product, className }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product?.stock === 0;

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
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
