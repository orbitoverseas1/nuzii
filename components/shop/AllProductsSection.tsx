"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Loader2 } from "lucide-react";

interface AllProductsSectionProps {
    categories: Array<{
        _id: string;
        title: string;
        slug: { current: string };
    }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProducts: any[];
}

export default function AllProductsSection({
    categories,
    initialProducts,
}: AllProductsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchProducts = async (categorySlug: string) => {
        try {
            setLoading(true);
            let query = "";

            if (categorySlug === "all") {
                query = `*[_type == "product"] | order(name asc)`;
            } else {
                query = `*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`;
            }

            const data = await client.fetch(query, { categorySlug });
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCategory !== "all") {
            fetchProducts(selectedCategory);
        } else {
            setProducts(initialProducts);
        }
    }, [selectedCategory, initialProducts]);

    const currentCategoryName =
        selectedCategory === "all"
            ? "All Products"
            : categories.find((c) => c.slug.current === selectedCategory)?.title ||
            "All Products";

    return (
        <section className="py-16 px-6 md:px-12 bg-nuziiBeige/30">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header with Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-light text-nuziiText mb-2">
                            Browse Our Collection
                        </h2>
                        <p className="text-lg text-nuziiTextLight font-light">
                            Explore our complete range of modest fashion
                        </p>
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-nuziiRoseGold/30 rounded-full hover:border-nuziiRoseGold transition-all duration-300 min-w-[200px] justify-between"
                        >
                            <span className="text-nuziiText font-light capitalize">
                                {currentCategoryName}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-nuziiRoseGold transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-nuziiBeige p-2 z-50">
                                <button
                                    onClick={() => {
                                        setSelectedCategory("all");
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCategory === "all"
                                        ? "bg-nuziiRoseGold text-white"
                                        : "hover:bg-nuziiCream text-nuziiText"
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() => {
                                            setSelectedCategory(category.slug.current);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors capitalize ${selectedCategory === category.slug.current
                                            ? "bg-nuziiRoseGold text-white"
                                            : "hover:bg-nuziiCream text-nuziiText"
                                            }`}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-nuziiRoseGold">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-lg font-light">Loading products...</span>
                        </div>
                    </div>
                ) : products?.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {products.map((product: any) => (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                <ProductCard key={product._id} product={product as any} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-nuziiTextLight text-lg font-light">
                            No products found in this category.
                        </p>
                    </div>
                )}

                {/* Product Count */}
                {!loading && products?.length > 0 && (
                    <div className="text-center mt-8">
                        <p className="text-nuziiTextLight font-light">
                            Showing {products.length} product{products.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
