"use client";
import useWishlistStore from "@/wishlistStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const WishlistIcon = () => {
  const { items } = useWishlistStore();

  return (
    <Link href={"/wishlist"} className="group relative text-nuziiText hover:text-nuziiRoseGoldDark transition-colors">
      <Heart className="w-5 h-5" />
      {items?.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-nuziiRoseGold text-white h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;
