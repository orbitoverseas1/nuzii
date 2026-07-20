import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

const DEFAULT_HEADING = "Explore the looks that define Nuzii.";
const DEFAULT_DESCRIPTION =
    "Essentials. Luxe. Modest Style Edit. Statement Pieces.\nCurated for women who love simple, elegant, everyday style.";

const DEFAULT_LOOKS: LookCard[] = [
    { _key: "essentials", title: "Essentials", color: "bg-nuziiBeige" },
    { _key: "luxe", title: "Luxe", color: "bg-nuziiCream" },
    { _key: "modest-style", title: "Modest Style Edit", color: "bg-nuziiSand" },
    { _key: "statement", title: "Statement Pieces", color: "bg-nuziiRoseGold/20" },
];

type LookCard = {
    _key?: string;
    title?: string | null;
    image?: SanityImageSource | null;
    alt?: string | null;
    link?: string | null;
    color?: string;
};

export type HomepageLooksSection = {
    isActive?: boolean | null;
    heading?: string | null;
    description?: string | null;
    cards?: Array<LookCard | null> | null;
};

export default function FeaturedCollections({
    section,
}: {
    section: HomepageLooksSection | null;
}) {
    if (section?.isActive === false) return null;

    const cards = Array.from({ length: 4 }, (_, index) => {
        const fallback = DEFAULT_LOOKS[index];
        const cmsCard = section?.cards?.[index];
        return {
            ...fallback,
            ...(cmsCard ?? {}),
            title: cmsCard?.title?.trim() || fallback.title,
        };
    });
    const heading = section?.heading?.trim() || DEFAULT_HEADING;
    const description = section?.description?.trim() || DEFAULT_DESCRIPTION;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-light text-nuziiText">
                        {heading}
                    </h2>
                    <p className="text-nuziiTextLight max-w-2xl mx-auto whitespace-pre-line">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {cards.map((card, index) => {
                        const key = card._key || `${card.title}-${index}`;
                        const isExternal = Boolean(card.link?.match(/^https?:\/\//i));
                        const cardContent = (
                            <>
                                <div
                                    className={`aspect-[3/4] ${card.color || "bg-nuziiBeige"} relative flex items-center justify-center`}
                                >
                                    {card.image ? (
                                        <Image
                                            src={urlFor(card.image)
                                                .width(700)
                                                .height(900)
                                                .url()}
                                            alt={card.alt || card.title || "Nuzii look"}
                                            fill
                                            sizes="(min-width: 1024px) 25vw, 50vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-nuziiTextLight">
                                            <span className="text-xs">Img</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-white/90 to-transparent pt-12">
                                    <h3 className="text-base sm:text-xl font-medium text-nuziiText group-hover:text-nuziiRoseGoldDark transition-colors">
                                        {card.title}
                                    </h3>
                                </div>
                            </>
                        );

                        return card.link ? (
                            <Link
                                key={key}
                                href={card.link}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group block relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
                            >
                                {cardContent}
                            </Link>
                        ) : (
                            <div
                                key={key}
                                className="group block relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
                            >
                                {cardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
