import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/sanity.types";

interface ProductShowcaseRowProps {
    showcases: Array<{
        _id: string;
        title: string;
        subtitle?: string;
        products: Array<{
            _id: string;
            name: string;
            slug: { current: string };
            price: number;
            discount: number;
            images: Array<{
                asset: {
                    _ref: string;
                    _type: string;
                };
            }>;
            status?: string;
        }>;
        backgroundColor?: string;
        ctaText?: string;
        ctaLink?: string;
    }>;
}

const bgColorMap: Record<string, string> = {
    "rose-gold": "bg-nuziiRoseGold/10",
    beige: "bg-nuziiBeige",
    cream: "bg-nuziiCream",
    sand: "bg-nuziiSand/20",
    white: "bg-white",
};

export default function ProductShowcaseRow({ showcases }: ProductShowcaseRowProps) {
    if (!showcases || showcases.length === 0) return null;

    return (
        <div className="space-y-16 py-12">
            {showcases.map((showcase) => {
                const bgClass = bgColorMap[showcase.backgroundColor || "cream"] || "bg-nuziiCream";

                return (
                    <section
                        key={showcase._id}
                        className={`${bgClass} py-12 px-6 md:px-12 rounded-3xl`}
                    >
                        <div className="container mx-auto max-w-7xl">
                            {/* Section Header */}
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-light text-nuziiText mb-2">
                                    {showcase.title}
                                </h2>
                                {showcase.subtitle && (
                                    <p className="text-lg text-nuziiTextLight font-light">
                                        {showcase.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Products Grid - 4 columns */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                {showcase.products?.slice(0, 4).map((product) => (
                                    <ProductCard key={product._id} product={product as Product} />
                                ))}
                            </div>

                            {/* CTA Button */}
                            {showcase.ctaText && showcase.ctaLink && (
                                <div className="text-center pt-4">
                                    <Link
                                        href={showcase.ctaLink}
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        {showcase.ctaText}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
