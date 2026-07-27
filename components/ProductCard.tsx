import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import ProductCardAction from "./ProductCardAction";

const ProductCard = ({ product }: { product: Product }) => {
  const primaryImage = product.images?.[0];
  const hoverImage = product.images?.[1];
  const productHref = `/product/${product.slug?.current}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white text-sm">
      <Link
        href={productHref}
        className="relative block aspect-square w-full overflow-hidden bg-nuziiCream"
        aria-label={`View ${product.name ?? "product"}`}
      >
        {primaryImage ? (
          <>
            <Image
              src={urlFor(primaryImage).width(900).height(900).fit("crop").url()}
              alt={product.name ?? "Product"}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none lg:group-hover:scale-[1.03]"
            />
            {hoverImage && (
              <Image
                src={urlFor(hoverImage).width(900).height(900).fit("crop").url()}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="hidden object-cover opacity-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none lg:block lg:group-hover:scale-[1.03] lg:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nuziiTextLight">
            Image unavailable
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col items-center px-1 pb-1 pt-3 text-center sm:px-2 sm:pt-4">
        <h3 className="min-h-10 line-clamp-2 text-sm font-normal leading-5 text-nuziiText sm:min-h-11 sm:text-[0.95rem] sm:leading-snug">
          <Link
            href={productHref}
            className="hover:underline hover:underline-offset-4"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 min-h-4">
          {product.variantInfo && (
            <p className="line-clamp-1 text-xs text-nuziiTextLight">
              {product.variantInfo}
            </p>
          )}
        </div>
        <div className="mt-2 min-h-5">
          <PriceView
            price={product.price}
            discount={product.discount}
            className="text-sm font-normal text-nuziiText"
          />
        </div>
        <div className="mt-auto w-full pt-4">
          <ProductCardAction product={product} />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
