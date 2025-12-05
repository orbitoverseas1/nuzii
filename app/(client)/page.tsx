import Hero from "@/components/landing/Hero";
import FeaturedCollections from "@/components/landing/FeaturedCollections";
import BestSellers from "@/components/landing/BestSellers";
import NewArrivals from "@/components/landing/NewArrivals";
import WhyChooseNuzii from "@/components/landing/WhyChooseNuzii";
import CustomerLove from "@/components/landing/CustomerLove";
import InstagramFeed from "@/components/landing/InstagramFeed";
import FooterCTA from "@/components/landing/FooterCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <NewArrivals />
      <WhyChooseNuzii />
      <CustomerLove />
      <InstagramFeed />
      <FooterCTA />
    </main>
  );
}
