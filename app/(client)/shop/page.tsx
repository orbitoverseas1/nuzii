import { client } from "@/sanity/lib/client";
import {
  SHOP_HERO_QUERY,
  PRODUCT_SHOWCASE_QUERY,
  PROMO_GRID_BANNERS_QUERY,
  MID_PAGE_BANNERS_QUERY,
  NEW_ARRIVALS_QUERY,
  BEST_SELLING_QUERY,
  TOP_RATED_QUERY,
  FEATURED_CATEGORIES_QUERY,
} from "@/sanity/helpers/shopQueries";
import ShopHero from "@/components/shop/ShopHero";
import ProductShowcaseRow from "@/components/shop/ProductShowcaseRow";
import PromotionalSection from "@/components/shop/PromotionalSection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import MidPageBanners from "@/components/shop/MidPageBanners";
import FeaturedCategories from "@/components/shop/FeaturedCategories";

const ShopPage = async () => {
  // Fetch all data in parallel
  const [
    heroes,
    showcases,
    promoBanners,
    midPageBanners,
    newArrivals,
    bestSelling,
    topRated,
    categories,
  ] = await Promise.all([
    client.fetch(SHOP_HERO_QUERY),
    client.fetch(PRODUCT_SHOWCASE_QUERY),
    client.fetch(PROMO_GRID_BANNERS_QUERY),
    client.fetch(MID_PAGE_BANNERS_QUERY),
    client.fetch(NEW_ARRIVALS_QUERY),
    client.fetch(BEST_SELLING_QUERY),
    client.fetch(TOP_RATED_QUERY),
    client.fetch(FEATURED_CATEGORIES_QUERY),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ShopHero heroes={heroes} />

      {/* Product Showcase Sections (Seasonal/Offers) */}
      <ProductShowcaseRow showcases={showcases} />

      {/* Promotional Grid Section */}
      <PromotionalSection banners={promoBanners} />

      {/* Featured Products with Tabs */}
      <FeaturedProducts
        newArrivals={newArrivals}
        bestSelling={bestSelling}
        topRated={topRated}
      />

      {/* Mid-Page Banners */}
      <MidPageBanners banners={midPageBanners} />

      {/* Featured Categories */}
      <FeaturedCategories categories={categories} />
    </div>
  );
};

export default ShopPage;
