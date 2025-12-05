import Link from "next/link";

const collections = [
    { name: "Essentials", color: "bg-nuziiBeige" },
    { name: "Luxe", color: "bg-nuziiCream" },
    { name: "Modest Style Edit", color: "bg-nuziiSand" },
    { name: "Statement Pieces", color: "bg-nuziiRoseGold/20" },
];

export default function FeaturedCollections() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-light text-nuziiText">
                        Explore the looks that define Nuzii.
                    </h2>
                    <p className="text-nuziiTextLight max-w-2xl mx-auto">
                        Essentials. Luxe. Modest Style Edit. Statement Pieces. <br />
                        Curated for women who love simple, elegant, everyday style.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {collections.map((collection, index) => (
                        <Link
                            key={index}
                            href={`/shop?category=${collection.name.toLowerCase().replace(/ /g, "-")}`}
                            className="group block relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
                        >
                            <div className={`aspect-[3/4] ${collection.color} relative flex items-center justify-center`}>
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                                <span className="sr-only">{collection.name}</span>
                                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-nuziiTextLight">
                                    <span className="text-xs">Img</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white/90 to-transparent pt-12">
                                <h3 className="text-xl font-medium text-nuziiText group-hover:text-nuziiRoseGoldDark transition-colors">
                                    {collection.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
