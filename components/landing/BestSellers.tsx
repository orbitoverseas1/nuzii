import Link from "next/link";
import HomepageProductCarousel from "./HomepageProductCarousel";
import type { Product } from "@/sanity.types";

export default function BestSellers({ products }: { products: Product[] }) {
    if (!products.length) return null;

    return (
        <section className="py-20 bg-nuziiBeige/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-light text-nuziiText">
                            Our most loved pieces.
                        </h2>
                        <p className="text-nuziiTextLight">
                            Handpicked for quality. Trusted by women who want style that lasts.
                        </p>
                    </div>
                    <Link
                        href="/shop?section=most-loved#featured-products"
                        className="text-nuziiRoseGoldDark hover:text-nuziiText font-medium border-b border-nuziiRoseGoldDark hover:border-nuziiText transition-colors pb-1"
                    >
                        Shop Best Sellers
                    </Link>
                </div>

                <HomepageProductCarousel products={products} label="Most Loved products" />
            </div>
        </section>
    );
}
