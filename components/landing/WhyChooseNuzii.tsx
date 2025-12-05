import { Star, Heart, ShieldCheck, Smile, Palette } from "lucide-react";

const benefits = [
    {
        icon: Star,
        title: "Quality that feels good",
        description: "Premium fabrics selected for comfort and longevity."
    },
    {
        icon: Heart,
        title: "Affordable for everyday",
        description: "Luxury feel without the luxury markup."
    },
    {
        icon: ShieldCheck,
        title: "Modest friendly designs",
        description: "Thoughtfully cut for coverage and confidence."
    },
    {
        icon: Smile,
        title: "Curated styles",
        description: "A focused collection to reduce decision stress."
    },
    {
        icon: Palette,
        title: "Reliable prints & colors",
        description: "True-to-life tones that match your wardrobe."
    }
];

export default function WhyChooseNuzii() {
    return (
        <section className="py-20 bg-nuziiBeige">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-nuziiText mb-4">
                        Why Choose Nuzii?
                    </h2>
                    <div className="w-20 h-1 bg-nuziiRoseGold mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 bg-white/50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-nuziiRoseGold/20 rounded-full flex items-center justify-center text-nuziiRoseGoldDark mb-4">
                                <benefit.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-medium text-nuziiText mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-nuziiTextLight leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
