"use client";

import { FEATURED_CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import { useEffect, useMemo, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "../ProductCard";
import Pagination from "./Pagination";
import NoProductAvailable from "./NoProductAvailable";

const PAGE_SIZE = 12;

interface Props {
  categories: FEATURED_CATEGORIES_QUERYResult;
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchProducts = async (categorySlug: string) => {
    try {
      setLoading(true);
      const query =
        categorySlug === "all"
          ? `*[_type == "product"] | order(name asc)`
          : `*[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`;

      const data = await client.fetch<Product[]>(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(slug);
    setPage(1);
  }, [slug]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page]
  );

  const selectedTitle =
    slug === "all"
      ? "All Products"
      : categories.find((item) => item.slug?.current === slug)?.title || slug;

  const tabClass = (active: boolean) =>
    `border-b pb-1 text-sm font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-300 ${
      active
        ? "border-darkColor text-darkColor"
        : "border-transparent text-nuziiText hover:border-nuziiText hover:text-darkColor"
    }`;

  return (
    <div className="py-5 md:py-8">
      <h1 className="text-center text-3xl font-normal capitalize text-nuziiRoseGoldDark md:text-4xl">
        {selectedTitle}
      </h1>

      <nav
        aria-label="Product categories"
        className="-mx-4 mt-7 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0"
      >
        <div className="mx-auto flex w-max min-w-full items-center justify-center gap-5 px-1 sm:gap-8 md:px-0 lg:gap-10">
          <Link
            href="/category/all"
            aria-current={slug === "all" ? "page" : undefined}
            className={tabClass(slug === "all")}
          >
            All Products
          </Link>

          {categories.map((item) => {
            const categorySlug = item.slug?.current;
            if (!categorySlug || !item.title) return null;

            return (
              <Link
                key={item._id}
                href={`/category/${categorySlug}`}
                aria-current={categorySlug === slug ? "page" : undefined}
                className={tabClass(categorySlug === slug)}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-10 w-full">
        {loading ? (
          <div className="flex min-h-80 w-full flex-col items-center justify-center space-y-4 bg-gray-100 py-10 text-center">
            <motion.div className="flex items-center space-x-2 text-nuziiRoseGoldDark">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Products are loading...</span>
            </motion.div>
          </div>
        ) : products.length ? (
          <>
            <div className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <AnimatePresence key={product._id}>
                  <motion.div
                    className="h-full"
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          </>
        ) : (
          <NoProductAvailable
            selectedTab={selectedTitle || slug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
