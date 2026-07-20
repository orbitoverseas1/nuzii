import Hero from "@/components/landing/Hero";
import FeaturedCollections, {
  type HomepageLooksSection,
} from "@/components/landing/FeaturedCollections";
import BestSellers from "@/components/landing/BestSellers";
import NewArrivals from "@/components/landing/NewArrivals";
import WhyChooseNuzii from "@/components/landing/WhyChooseNuzii";
import CustomerLove from "@/components/landing/CustomerLove";
import InstagramFeed from "@/components/landing/InstagramFeed";
import FooterCTA from "@/components/landing/FooterCTA";
import { sanityFetch } from "@/sanity/lib/live";
import {
  HOMEPAGE_MOST_LOVED_QUERY,
  HOMEPAGE_LOOKS_QUERY,
  HOMEPAGE_FRESH_DROPS_QUERY,
} from "@/sanity/helpers/shopQueries";
import type { Product } from "@/sanity.types";

export default async function Home() {
  const [
    { data: homepageLooks },
    { data: mostLoved },
    { data: freshDrops },
  ] = await Promise.all([
    sanityFetch({ query: HOMEPAGE_LOOKS_QUERY }),
    sanityFetch({ query: HOMEPAGE_MOST_LOVED_QUERY }),
    sanityFetch({ query: HOMEPAGE_FRESH_DROPS_QUERY }),
  ]);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <FeaturedCollections
        section={homepageLooks as HomepageLooksSection | null}
      />
      <BestSellers products={(mostLoved ?? []) as Product[]} />
      <NewArrivals products={(freshDrops ?? []) as Product[]} />
      <WhyChooseNuzii />
      <CustomerLove />
      <InstagramFeed />
      <FooterCTA />
    </main>
  );
}
