"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

const CAROUSEL_IMAGES = [
 
    {
        id: 1,
        src: "/images/landing/bg-carousel.png",
        alt: "Timeless style",
    },
    {
        id: 2,
        src: "/images/landing/bg-carousel-2.png",
        alt: "Modern elegance",
    },
    {
        id: 3,
        src: "/images/landing/bg-carousel-3.png",
        alt: "Modern elegance",
    },
];

export default function Hero() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 60 }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-nuziiCream">
            {/* Carousel Background */}
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full">
                    {CAROUSEL_IMAGES.map((image, index) => (
                        <div key={image.id} className="relative flex-[0_0_100%] h-full min-w-0">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Dark Overlay for better text visibility */}
                            <div className="absolute inset-0 bg-black/30" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center gap-6 max-w-4xl"
                >
                    {/* <div className="relative w-48 md:w-64 h-24 mb-4">
                        <Image
                            src="/images/nuzi-logo.png"
                            alt="Nuzii Logo"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div> */}
                    

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight drop-shadow-lg">
                        Elevate Your Everyday Style
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-xl drop-shadow-md">
                        Modest friendly fashion that feels premium without the high price.
                        Timeless pieces for the modern woman.
                    </p>

                    {/* CTA Buttons */}
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg group min-w-[160px]"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-nuziiRoseGoldDark px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg group min-w-[160px]"
                        >
                            View Collection
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                {CAROUSEL_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === selectedIndex
                                ? "bg-white w-8"
                                : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
