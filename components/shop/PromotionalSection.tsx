import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface PromotionalSectionProps {
    banners: Array<{
        _id: string;
        title: string;
        description?: string;
        image: {
            asset: {
                _ref: string;
                _type: string;
            };
        };
        ctaText?: string;
        ctaLink: string;
        size: string;
        placement: string;
    }>;
}

export default function PromotionalSection({ banners }: PromotionalSectionProps) {
    if (!banners || banners.length === 0) return null;

    // Organize banners by placement
    const leftBanner = banners.find((b) => b.placement === "promo-left");
    const topRight1 = banners.find((b) => b.placement === "promo-top-right-1");
    const topRight2 = banners.find((b) => b.placement === "promo-top-right-2");
    const bottomRight = banners.find((b) => b.placement === "promo-bottom-right");

    return (
        <section className="py-12 px-6 md:px-12">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Block - Large Banner */}
                    {leftBanner && (
                        <Link
                            href={leftBanner.ctaLink}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[500px]"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={urlFor(leftBanner.image).url()}
                                    alt={leftBanner.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <h3 className="text-3xl md:text-4xl font-light mb-2">
                                        {leftBanner.title}
                                    </h3>
                                    {leftBanner.description && (
                                        <p className="text-lg font-light mb-4 opacity-90">
                                            {leftBanner.description}
                                        </p>
                                    )}
                                    {leftBanner.ctaText && (
                                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark rounded-full transition-colors">
                                            {leftBanner.ctaText}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Right Block - Three smaller banners */}
                    <div className="grid grid-rows-2 gap-6">
                        {/* Top Row - Two small banners */}
                        <div className="grid grid-cols-2 gap-6">
                            {topRight1 && (
                                <Link
                                    href={topRight1.ctaLink}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative w-full h-full min-h-[240px]">
                                        <Image
                                            src={urlFor(topRight1.image).url()}
                                            alt={topRight1.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h4 className="text-lg md:text-xl font-light mb-1">
                                                {topRight1.title}
                                            </h4>
                                            {topRight1.ctaText && (
                                                <span className="text-sm opacity-90">{topRight1.ctaText} →</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {topRight2 && (
                                <Link
                                    href={topRight2.ctaLink}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative w-full h-full min-h-[240px]">
                                        <Image
                                            src={urlFor(topRight2.image).url()}
                                            alt={topRight2.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h4 className="text-lg md:text-xl font-light mb-1">
                                                {topRight2.title}
                                            </h4>
                                            {topRight2.ctaText && (
                                                <span className="text-sm opacity-90">{topRight2.ctaText} →</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Bottom Row - Wide banner */}
                        {bottomRight && (
                            <Link
                                href={bottomRight.ctaLink}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative w-full h-full min-h-[240px]">
                                    <Image
                                        src={urlFor(bottomRight.image).url()}
                                        alt={bottomRight.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h4 className="text-2xl md:text-3xl font-light mb-2">
                                            {bottomRight.title}
                                        </h4>
                                        {bottomRight.description && (
                                            <p className="text-sm opacity-90 mb-2">{bottomRight.description}</p>
                                        )}
                                        {bottomRight.ctaText && (
                                            <span className="inline-flex items-center gap-2 px-5 py-2 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark rounded-full text-sm transition-colors">
                                                {bottomRight.ctaText}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
