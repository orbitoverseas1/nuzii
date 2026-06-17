import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newArrivals = [
    { id: 1, name: "Textured Knit Cardigan", price: "LKR 75.00", tag: "New" },
    { id: 2, name: "Wide Leg Trousers", price: "LKR 58.00", tag: "Hot" },
    { id: 3, name: "Satin Wrap Dress", price: "LKR 95.00", tag: "New" },
    { id: 4, name: "Cotton Poplin Shirt", price: "LKR 45.00", tag: "Essential" },
];

export default function NewArrivals() {
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {newArrivals.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-nuziiBeige/50 rounded-2xl relative overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:bg-nuziiRoseGold/10">
                                {/* Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-nuziiText/20 font-medium">
                                    New Arrival
                                </div>

                                {/* Tag */}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-nuziiText shadow-sm">
                                    {product.tag}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-nuziiText group-hover:text-nuziiRoseGoldDark transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-nuziiTextLight">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/shop?sort=newest"
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
