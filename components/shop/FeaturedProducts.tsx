"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "motion/react";

interface Product {
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
    rating?: number;
}

interface FeaturedProductsProps {
    newArrivals: Product[];
    bestSelling: Product[];
    topRated: Product[];
}

type TabType = "new" | "best" | "top";

export default function FeaturedProducts({
    newArrivals,
    bestSelling,
    topRated,
}: FeaturedProductsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("new");

    const tabs = [
        { id: "new" as TabType, label: "New Arrival", products: newArrivals },
        { id: "best" as TabType, label: "Best Selling", products: bestSelling },
        { id: "top" as TabType, label: "Top Rated", products: topRated },
    ];

    const currentProducts = tabs.find((tab) => tab.id === activeTab)?.products || [];

    return (
        <section className="py-16 px-6 md:px-12 bg-white">
            <div className="container mx-auto max-w-7xl">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-light text-nuziiText mb-4">
                        Featured Products
                    </h2>
                    <p className="text-lg text-nuziiTextLight font-light max-w-2xl mx-auto">
                        Discover our handpicked selection of premium modest fashion
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-full font-light transition-all duration-300 ${activeTab === tab.id
                                ? "bg-nuziiRoseGold text-white shadow-lg"
                                : "bg-nuziiBeige text-nuziiText hover:bg-nuziiSand"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid - 3 rows x 4 columns = 12 products */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {currentProducts?.slice(0, 12).map((product) => (
                            <ProductCard key={product._id} product={product as any} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {currentProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-nuziiTextLight text-lg">
                            No products available in this category yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
