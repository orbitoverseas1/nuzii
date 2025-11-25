import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";

const products = [
    { id: 1, name: "Silk Touch Abaya", price: "$89.00", category: "Luxe" },
    { id: 2, name: "Everyday Linen Set", price: "$65.00", category: "Essentials" },
    { id: 3, name: "Pleated Maxi Skirt", price: "$55.00", category: "Bottoms" },
    { id: 4, name: "Chiffon Hijab - Rose", price: "$18.00", category: "Accessories" },
];

export default function BestSellers() {
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
                        href="/shop"
                        className="text-nuziiRoseGoldDark hover:text-nuziiText font-medium border-b border-nuziiRoseGoldDark hover:border-nuziiText transition-colors pb-1"
                    >
                        Shop Best Sellers
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                                {/* Placeholder Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    Product Img
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <button className="p-3 bg-white text-nuziiText rounded-full shadow-lg hover:bg-nuziiRoseGold hover:text-white transition-colors" aria-label="Quick View">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-white text-nuziiText rounded-full shadow-lg hover:bg-nuziiRoseGold hover:text-white transition-colors" aria-label="Add to Cart">
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-xs text-nuziiTextLight mb-1">{product.category}</p>
                                <h3 className="font-medium text-nuziiText mb-2">{product.name}</h3>
                                <p className="text-nuziiRoseGoldDark font-semibold">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
