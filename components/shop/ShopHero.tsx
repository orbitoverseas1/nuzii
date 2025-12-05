"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopHeroProps {
    heroes: Array<{
        _id: string;
        seasonTitle: string;
        mainHeading: string;
        subheading?: string;
        primaryButtonText?: string;
        primaryButtonLink?: string;
        secondaryButtonText?: string;
        secondaryButtonLink?: string;
        heroImage: {
            asset: {
                _ref: string;
                _type: string;
            };
        };
        order: number;
    }>;
}

export default function ShopHero({ heroes }: ShopHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!heroes || heroes.length === 0) return null;

    const currentHero = heroes[currentIndex];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    };

    return (
        <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={urlFor(currentHero.heroImage).url()}
                    alt={currentHero.mainHeading}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
            </div>

            {/* Centered Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-20">
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8">
                    {/* Text Content */}
                    <div className="space-y-6">
                        <p className="text-sm md:text-base font-light tracking-widest text-white/90 uppercase">
                            {currentHero.seasonTitle}
                        </p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.1]">
                            {currentHero.mainHeading}
                        </h1>
                        {currentHero.subheading && (
                            <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                                {currentHero.subheading}
                            </p>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4 justify-center">
                        {currentHero.primaryButtonText && currentHero.primaryButtonLink && (
                            <Link
                                href={currentHero.primaryButtonLink}
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                {currentHero.primaryButtonText}
                            </Link>
                        )}
                        {currentHero.secondaryButtonText && currentHero.secondaryButtonLink && (
                            <Link
                                href={currentHero.secondaryButtonLink}
                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-nuziiText rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                                {currentHero.secondaryButtonText}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Carousel Controls */}
            {heroes.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-nuziiText" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-nuziiText" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {heroes.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? "bg-white w-8"
                                    : "bg-white/60 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
