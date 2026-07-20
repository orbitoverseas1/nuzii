import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomepageProductCarousel from "./HomepageProductCarousel";
import type { Product } from "@/sanity.types";

export default function NewArrivals({ products }: { products: Product[] }) {
    if (!products.length) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-light text-nuziiText">
                        Fresh drops for your wardrobe.
                    </h2>
                    <p className="text-nuziiTextLight max-w-2xl">
                        Soft fabrics. Timeless colors. Everyday comfort.
                    </p>
                </div>

                <div className="mb-12">
                    <HomepageProductCarousel products={products} label="Fresh Drops products" />
                </div>

                <div className="text-center">
                    <Link
                        href="/shop?section=fresh-drops#featured-products"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-nuziiText text-nuziiText rounded-full hover:bg-nuziiText hover:text-white transition-all duration-300"
                    >
                        <span>Explore New Arrivals</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
