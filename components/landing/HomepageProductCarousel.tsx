"use client";

import ProductCard from "@/components/ProductCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/sanity.types";

export default function HomepageProductCarousel({
    products,
    label,
}: {
    products: Product[];
    label: string;
}) {
    return (
        <Carousel
            opts={{ align: "start", slidesToScroll: 1 }}
            className="w-full"
            aria-label={label}
        >
            <CarouselContent className="-ml-3 sm:-ml-8">
                {products.map((product) => (
                    <CarouselItem
                        key={product._id}
                        className="basis-1/2 pl-3 md:basis-1/3 lg:basis-1/4 sm:pl-8"
                    >
                        <ProductCard product={product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:inline-flex left-2 z-10 h-10 w-10 border-0 bg-white/95 shadow-md hover:bg-white disabled:pointer-events-none disabled:opacity-0" />
            <CarouselNext className="hidden md:inline-flex right-2 z-10 h-10 w-10 border-0 bg-white/95 shadow-md hover:bg-white disabled:pointer-events-none disabled:opacity-0" />
        </Carousel>
    );
}
