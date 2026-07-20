import React from "react";
import { Button } from "./ui/button";
import { HiMinus, HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";
import useCartStore, { SelectedVariant, getCartLineKey } from "@/store";
import { Product } from "@/sanity.types";
import { twMerge } from "tailwind-merge";

interface Props {
  product: Product;
  selectedVariant?: SelectedVariant;
  className?: string;
  borderStyle?: string;
}

const QuantityButtons = ({
  product,
  selectedVariant,
  className,
  borderStyle,
}: Props) => {
  const { addItem, removeItem, getItemCount } = useCartStore();
  const lineKey = getCartLineKey(product?._id, selectedVariant);
  const itemCount = getItemCount(lineKey);
  const isOutOfStock = selectedVariant
    ? (selectedVariant.stock ?? 0) <= 0
    : product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(lineKey);
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };
  return (
    <div
      className={twMerge(
        "flex items-center gap-1 pb-1 text-base",
        borderStyle,
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="w-6 h-6 cursor-pointer"
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
      >
        <HiMinus />
      </Button>
      <span className="font-semibold w-8 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="w-6 h-6 cursor-pointer"
        onClick={() => {
          addItem(product, selectedVariant);
          toast.success("Quantity increased successfully!");
        }}
        disabled={isOutOfStock}
      >
        <HiPlus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
