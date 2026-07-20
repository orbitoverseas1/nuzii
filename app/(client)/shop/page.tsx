import { client } from "@/sanity/lib/client";
import {
  SHOP_HERO_QUERY,
  PRODUCT_SHOWCASE_QUERY,
  PROMO_GRID_BANNERS_QUERY,
  MID_PAGE_BANNERS_QUERY,
  HOMEPAGE_MOST_LOVED_QUERY,
  HOMEPAGE_FRESH_DROPS_QUERY,
  TOP_RATED_QUERY,
  FEATURED_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
} from "@/sanity/helpers/shopQueries";
import ShopHero from "@/components/shop/ShopHero";
import ProductShowcaseRow from "@/components/shop/ProductShowcaseRow";
import PromotionalSection from "@/components/shop/PromotionalSection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import MidPageBanners from "@/components/shop/MidPageBanners";
import FeaturedCategories from "@/components/shop/FeaturedCategories";
import AllProductsSection from "@/components/shop/AllProductsSection";

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>;
}) => {
  const section = (await searchParams)?.section;
  const initialTab = section === "most-loved" ? "best" : section === "fresh-drops" ? "new" : undefined;
  // Fetch all data in parallel
  const [
    heroes,
    showcases,
    promoBanners,
    midPageBanners,
    homepageFreshDrops,
    homepageMostLoved,
    topRated,
    categories,
    allProducts,
  ] = await Promise.all([
    client.fetch(SHOP_HERO_QUERY),
    client.fetch(PRODUCT_SHOWCASE_QUERY),
    client.fetch(PROMO_GRID_BANNERS_QUERY),
    client.fetch(MID_PAGE_BANNERS_QUERY),
    client.fetch(HOMEPAGE_FRESH_DROPS_QUERY),
    client.fetch(HOMEPAGE_MOST_LOVED_QUERY),
    client.fetch(TOP_RATED_QUERY),
    client.fetch(FEATURED_CATEGORIES_QUERY),
    client.fetch(ALL_PRODUCTS_QUERY),
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
        newArrivals={homepageFreshDrops ?? []}
        bestSelling={homepageMostLoved ?? []}
        topRated={topRated}
        initialTab={initialTab}
      />

      {/* Mid-Page Banners */}
      <MidPageBanners banners={midPageBanners} />

      {/* All Products Section with Category Filter */}
      <AllProductsSection categories={categories} initialProducts={allProducts} />

      {/* Featured Categories */}
      <FeaturedCategories categories={categories} />
    </div>
  );
};

export default ShopPage;

