"use client";

import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import useWishlistStore from "@/wishlistStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const WishlistPage = () => {
  const items = useWishlistStore((state) => state.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Container className="py-10 min-h-[50vh]">
      <div className="flex items-center gap-2 py-5">
        <Heart className="h-6 w-6 text-darkColor" />
        <h1 className="text-2xl font-semibold">My Wishlist</h1>
      </div>

      {items.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishlistPage;
