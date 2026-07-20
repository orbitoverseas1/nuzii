import { defineQuery } from "next-sanity";

// Hero section query
export const SHOP_HERO_QUERY = defineQuery(`
  *[_type == "shopHero" && isActive == true] | order(order asc) {
    _id,
    seasonTitle,
    mainHeading,
    subheading,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    heroImage,
    order
  }
`);

// Product showcase query
export const PRODUCT_SHOWCASE_QUERY = defineQuery(`
  *[_type == "productShowcase" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    products[]-> {
      _id,
      name,
      slug,
      price,
      discount,
      images,
      status
    },
    backgroundColor,
    ctaText,
    ctaLink
  }
`);

// Promotional banners query by placement
export const PROMO_BANNERS_QUERY = defineQuery(`
  *[_type == "shopBanner" && isActive == true && placement match $placement] | order(_createdAt desc) {
    _id,
    title,
    description,
    image,
    ctaText,
    ctaLink,
    placement
  }
`);

// All promotional grid banners
export const PROMO_GRID_BANNERS_QUERY = defineQuery(`
  *[_type == "shopBanner" && isActive == true && placement match "promo-*"] {
    _id,
    title,
    description,
    image,
    ctaText,
    ctaLink,
    placement
  }
`);

// Mid-page banners
export const MID_PAGE_BANNERS_QUERY = defineQuery(`
  *[_type == "shopBanner" && isActive == true && placement match "mid-*"] {
    _id,
    title,
    description,
    image,
    ctaText,
    ctaLink,
    placement
  }
`);

// Featured products - New Arrivals
export const NEW_ARRIVALS_QUERY = defineQuery(`
  *[_type == "product" && status == "new"] | order(_createdAt desc) [0...12] {
    ...
  }
`);

// Featured products - Best Selling
export const BEST_SELLING_QUERY = defineQuery(`
  *[_type == "product" && isBestSelling == true] | order(salesCount desc) [0...12] {
    ...
  }
`);

// Homepage - drag-and-drop Most Loved products
export const HOMEPAGE_MOST_LOVED_QUERY = defineQuery(`
  *[_type == "homepageProductSections" && _id == "homepageProductSections"][0].mostLoved[]-> {
      ...
  }
`);

// Homepage - drag-and-drop Fresh Drops products
export const HOMEPAGE_FRESH_DROPS_QUERY = defineQuery(`
  *[_type == "homepageProductSections" && _id == "homepageProductSections"][0].freshDrops[]-> {
      ...
  }
`);

// Featured products - Top Rated
export const TOP_RATED_QUERY = defineQuery(`
  *[_type == "product" && isTopRated == true] | order(rating desc) [0...12] {
    _id,
    name,
    slug,
    price,
    discount,
    images,
    status,
    rating
  }
`);

// Featured categories with images
export const FEATURED_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    image
  }
`);

// Editorial image cards for the homepage "Explore the looks" section
export const HOMEPAGE_LOOKS_QUERY = defineQuery(`
  *[_type == "homepageLooks" && _id == "homepageLooks"][0] {
    _id,
    isActive,
    heading,
    description,
    cards[] {
      _key,
      title,
      image,
      alt,
      link
    }
  }
`);

// All products query
export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(name asc) {
    _id,
    name,
    slug,
    price,
    discount,
    images,
    status,
    rating,
    categories
  }
`);

