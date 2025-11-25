import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface FeaturedCategoriesProps {
    categories: Array<{
        _id: string;
        title: string;
        slug: { current: string };
        description?: string;
        image?: {
            asset: {
                _ref: string;
                _type: string;
            };
        };
    }>;
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="py-16 px-6 md:px-12 bg-nuziiBeige">
            <div className="container mx-auto max-w-7xl">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-light text-nuziiText mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-nuziiTextLight font-light max-w-2xl mx-auto">
                        Explore our curated collections designed for your modest lifestyle
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/category/${category.slug.current}`}
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {/* Category Image */}
                            <div className="relative w-full aspect-[3/4] overflow-hidden">
                                {category.image ? (
                                    <Image
                                        src={urlFor(category.image).url()}
                                        alt={category.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-nuziiRoseGold/20 to-nuziiSand/40 flex items-center justify-center">
                                        <span className="text-6xl text-nuziiRoseGold/40">
                                            {category.title.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Category Info */}
                            <div className="p-6 relative">
                                <h3 className="text-xl font-light text-nuziiText mb-2 group-hover:text-nuziiRoseGoldDark transition-colors">
                                    {category.title}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-nuziiTextLight font-light line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                                {/* Decorative border on hover */}
                                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-nuziiRoseGold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
