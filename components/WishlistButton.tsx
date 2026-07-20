"use client";
import { Product } from "@/sanity.types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import useWishlistStore from "@/wishlistStore";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const WishlistButton = ({ product, className }: Props) => {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product?._id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
        toast.success(
          wishlisted ? "Removed from wishlist" : "Added to wishlist"
        );
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("hoverEffect", className)}
    >
      <Heart
        className={cn(
          "w-4 h-4 md:w-5 md:h-5 transition-colors",
          wishlisted ? "fill-red-600 text-red-600" : "text-gray-500 hover:text-red-600"
        )}
      />
    </button>
  );
};

export default WishlistButton;
