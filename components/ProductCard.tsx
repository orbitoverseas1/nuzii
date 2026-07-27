import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import BuyNowButton from "./BuyNowButton";
import AddToBagButton from "./AddToBagButton";
import WishlistButton from "./WishlistButton";
import Title from "./Title";
import { isProductOutOfStock } from "@/lib/productStock";

const ProductCard = ({ product }: { product: Product }) => {
  const inStock = !isProductOutOfStock(product);

  return (
    <div className="rounded-lg overflow-hidden group text-sm">
      <div className="overflow-hidden relative" style={{ backgroundColor: '#f2e6e5' }}>
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              // loading="lazy"
              priority
              className={`w-full h-72 object-contain overflow-hidden  transition-transform duration-500 ${inStock && "group-hover:scale-105"}`}
            />
          </Link>
        )}
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-md rounded-tl-none rounded-tr-none">
        <Title className="text-base line-clamp-1">{product?.name}</Title>
        <p>{product?.variantInfo}</p>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-lg"
        />
        <div className="flex items-center gap-2">
          <BuyNowButton product={product} />
          <AddToBagButton product={product} className="w-12 h-12 shrink-0" />
          <WishlistButton product={product} className="w-12 h-12 shrink-0 flex items-center justify-center border border-darkColor/30 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
