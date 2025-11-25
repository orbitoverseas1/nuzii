import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-nuziiCream">
            {/* Abstract Curved Background Shapes */}
            <div className="absolute inset-0 z-0">
                {/* Large curved shape - bottom left */}
                <svg
                    className="absolute -bottom-20 -left-32 w-[800px] h-[800px] opacity-60"
                    viewBox="0 0 800 800"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 400C0 179.086 179.086 0 400 0C620.914 0 800 179.086 800 400C800 620.914 620.914 800 400 800C179.086 800 0 620.914 0 400Z"
                        fill="#E0BFB8"
                        fillOpacity="0.3"
                    />
                    <path
                        d="M100 500C100 279.086 279.086 100 500 100C720.914 100 900 279.086 900 500"
                        stroke="#C8A6A0"
                        strokeWidth="2"
                        strokeOpacity="0.2"
                    />
                </svg>

                {/* Curved shape - top right */}
                <svg
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] opacity-50"
                    viewBox="0 0 700 700"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M350 0C543.3 0 700 156.7 700 350C700 543.3 543.3 700 350 700C156.7 700 0 543.3 0 350C0 156.7 156.7 0 350 0Z"
                        fill="#F5F1EA"
                        fillOpacity="0.5"
                    />
                    <ellipse
                        cx="350"
                        cy="200"
                        rx="200"
                        ry="150"
                        fill="#E0BFB8"
                        fillOpacity="0.2"
                    />
                </svg>

                {/* Flowing curved wave - middle */}
                <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40"
                    viewBox="0 0 1200 800"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 400 Q 300 200, 600 400 T 1200 400 L 1200 800 L 0 800 Z"
                        fill="#E0BFB8"
                        fillOpacity="0.15"
                    />
                    <path
                        d="M0 500 Q 400 300, 800 500 T 1600 500"
                        stroke="#C8A6A0"
                        strokeWidth="3"
                        strokeOpacity="0.2"
                        fill="none"
                    />
                </svg>

                {/* Small accent curves */}
                <svg
                    className="absolute top-1/4 right-1/4 w-[300px] h-[300px] opacity-30"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="150" cy="150" r="100" fill="#D8CFC4" fillOpacity="0.3" />
                    <circle cx="180" cy="120" r="60" fill="#F5F1EA" fillOpacity="0.4" />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
                    {/* Left Column - Text Content */}
                    <div className="space-y-8 order-1 lg:order-1">
                        <div className="space-y-6">

                            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-nuziiText leading-[1.1]">
                                Elevate Your <br />
                                <span className="font-medium text-nuziiRoseGoldDark">Everyday Style</span>
                            </h1>
                            <p className="text-lg md:text-xl text-nuziiTextLight font-light max-w-md">
                                Modest friendly fashion that feels premium without the high price.
                                Timeless pieces for the modern woman.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-2">
                            <Link
                                href="/shop"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Shop Now
                            </Link>
                        </div>

                        {/* Decorative text elements */}
                        <div className="pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-nuziiTextLight">
                                <div className="w-12 h-[1px] bg-nuziiSand"></div>
                                <p className="text-sm font-light tracking-wide">Modest • Timeless • Elegant</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image with Organic Shape */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[3/4] max-w-lg mx-auto lg:ml-auto">
                            {/* Organic blob shape using clip-path */}
                            <div
                                className="w-full h-full rounded-[40% 60% 70% 30% / 40% 50% 60% 50%] overflow-hidden shadow-2xl relative"
                                style={{
                                    clipPath:
                                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                                }}
                            >
                                <Image
                                    src="/images/landing/hero-woman.png"
                                    alt="Nuzii Modest Fashion"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Decorative floating elements around image */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-nuziiRoseGold/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-nuziiBeige/60 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 -right-4 w-24 h-24 bg-nuziiSand/30 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-nuziiCream/20 pointer-events-none"></div>
        </section>
    );
}
