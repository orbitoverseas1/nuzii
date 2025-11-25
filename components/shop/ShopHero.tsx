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
        <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-nuziiCream">
            {/* Abstract Curved Background Shapes */}
            <div className="absolute inset-0 z-0">
                <svg
                    className="absolute -bottom-20 -left-32 w-[800px] h-[800px] opacity-60"
                    viewBox="0 0 800 800"
                    fill="none"
                >
                    <path
                        d="M0 400C0 179.086 179.086 0 400 0C620.914 0 800 179.086 800 400C800 620.914 620.914 800 400 800C179.086 800 0 620.914 0 400Z"
                        fill="#E0BFB8"
                        fillOpacity="0.3"
                    />
                </svg>
                <svg
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] opacity-50"
                    viewBox="0 0 700 700"
                    fill="none"
                >
                    <path
                        d="M350 0C543.3 0 700 156.7 700 350C700 543.3 543.3 700 350 700C156.7 700 0 543.3 0 350C0 156.7 156.7 0 350 0Z"
                        fill="#F5F1EA"
                        fillOpacity="0.5"
                    />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
                    {/* Left Column - Text Content */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="space-y-6">
                            <p className="text-sm md:text-base font-light tracking-widest text-nuziiRoseGoldDark uppercase">
                                {currentHero.seasonTitle}
                            </p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-nuziiText leading-[1.1]">
                                {currentHero.mainHeading}
                            </h1>
                            {currentHero.subheading && (
                                <p className="text-lg md:text-xl text-nuziiTextLight font-light max-w-md">
                                    {currentHero.subheading}
                                </p>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
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
                                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-nuziiRoseGold text-nuziiRoseGoldDark hover:bg-nuziiRoseGold hover:text-white rounded-full transition-all duration-300"
                                >
                                    {currentHero.secondaryButtonText}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Hero Image */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[3/4] max-w-lg mx-auto lg:ml-auto">
                            <div
                                className="w-full h-full rounded-[40% 60% 70% 30% / 40% 50% 60% 50%] overflow-hidden shadow-2xl relative"
                                style={{
                                    clipPath:
                                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                                }}
                            >
                                <Image
                                    src={urlFor(currentHero.heroImage).url()}
                                    alt={currentHero.mainHeading}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Decorative floating elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-nuziiRoseGold/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-nuziiBeige/60 rounded-full blur-3xl"></div>
                        </div>
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
                                    ? "bg-nuziiRoseGoldDark w-8"
                                    : "bg-nuziiSand hover:bg-nuziiRoseGold"
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
