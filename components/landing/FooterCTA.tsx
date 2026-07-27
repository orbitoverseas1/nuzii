import Link from "next/link";

export default function FooterCTA() {
    return (
        <section className="py-24 bg-nuziiBeige">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-nuziiText mb-6">
                    Join the Nuzii community.
                </h2>
                <p className="text-lg text-nuziiTextLight mb-10 max-w-xl mx-auto">
                    Get early access to new drops, style edits, and exclusive offers.
                    Elevate your everyday with us.
                </p>
                <Link
                    href="/shop"
                    className="inline-block px-10 py-4 bg-nuziiText text-white rounded-full text-lg font-medium shadow-lg hover:bg-nuziiRoseGoldDark hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    Shop the Collection
                </Link>
            </div>
        </section>
    );
}
