"use client";

import { FEATURED_CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import ProductCard from "../ProductCard";
import Title from "../Title";
import NoProductAvailable from "./NoProductAvailable";

interface Props {
  categories: FEATURED_CATEGORIES_QUERYResult;
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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
    fetchProducts(currentSlug);
  }, [currentSlug]);

  const selectedTitle =
    currentSlug === "all"
      ? "All Products"
      : categories.find((item) => item.slug?.current === currentSlug)?.title ||
        currentSlug;

  const tabClass = (active: boolean) =>
    `bg-transparent border-0 rounded-none text-darkColor shadow-none hover:bg-darkColor hover:text-white font-semibold hoverEffect border-b last:border-b-0 ${
      active ? "bg-darkColor text-white border-darkColor" : ""
    }`;

  return (
    <div className="py-5">
      <Title className="text-xl">
        {currentSlug === "all" ? (
          "All Products"
        ) : (
          <>
            Products by Category:{" "}
            <span className="font-bold text-green-600 capitalize tracking-wide">
              {selectedTitle}
            </span>
          </>
        )}
      </Title>

      <div className="mt-5 flex flex-col md:flex-row items-start gap-5">
        <div className="flex flex-col md:min-w-40 border">
          <Button
            onClick={() => setCurrentSlug("all")}
            className={tabClass(currentSlug === "all")}
          >
            All Products
          </Button>
          {categories?.map((item) => (
            <Button
              key={item?._id}
              onClick={() => setCurrentSlug(item?.slug?.current as string)}
              className={tabClass(item?.slug?.current === currentSlug)}
            >
              {item?.title}
            </Button>
          ))}
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
              <motion.div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Products are loading...</span>
              </motion.div>
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {products.map((product) => (
                <AnimatePresence key={product._id}>
                  <motion.div
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
          ) : (
            <NoProductAvailable
              selectedTab={selectedTitle || currentSlug}
              className="mt-0 w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
