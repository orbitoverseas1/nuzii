import { MessageCircle } from "lucide-react";

const testimonials = [
    {
        quote: "The quality is amazing, honestly better than I expected for the price.",
        author: "Sarah M.",
        role: "Verified Buyer"
    },
    {
        quote: "Finally found my style! Modest, chic, and so comfortable.",
        author: "Amina K.",
        role: "Verified Buyer"
    },
    {
        quote: "Looks even better in real life. The fabric falls so beautifully.",
        author: "Layla R.",
        role: "Verified Buyer"
    }
];

export default function CustomerLove() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-nuziiText">
                        Customer Love
                    </h2>
                    <p className="text-nuziiTextLight mt-4">
                        Real messages from happy shoppers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-nuziiCream p-8 rounded-2xl rounded-tr-none shadow-sm border border-nuziiBeige"
                        >
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-nuziiRoseGold text-white rounded-full flex items-center justify-center shadow-md">
                                <MessageCircle className="w-5 h-5" />
                            </div>

                            <p className="text-nuziiText text-lg italic mb-6 leading-relaxed">
                                &ldquo;{item.quote}&rdquo;
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-nuziiText">{item.author}</h4>
                                    <span className="text-xs text-nuziiRoseGoldDark font-medium uppercase tracking-wide">
                                        {item.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Proof Elements */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for social logos */}
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                </div>
            </div>
        </section>
    );
}
