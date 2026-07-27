import Container from "@/components/Container";
import ImageView from "@/components/new/ImageView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductPageActions from "@/components/new/ProductPageActions";
import ProductPurchasePanel from "@/components/new/ProductPurchasePanel";
import { getProductBySlug } from "@/sanity/helpers";
import { isProductOutOfStock } from "@/lib/productStock";
import { notFound } from "next/navigation";
import React from "react";
import { PortableText } from "@portabletext/react";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const hasImages = (product.images?.length ?? 0) > 0;
  const outOfStock = isProductOutOfStock(product);
  const eyebrow = [product.brand || "NUZII", product.collection]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="bg-white">
      <Container
        className={`flex max-w-[1600px] flex-col items-start gap-8 py-6 md:px-6 md:py-10 lg:flex-row lg:gap-12 ${
          hasImages ? "" : "max-w-3xl"
        }`}
      >
        {hasImages && (
          <ImageView images={product.images} productName={product.name} />
        )}

        <section
          className={`w-full ${
            hasImages ? "lg:sticky lg:top-28 lg:w-[38%]" : ""
          }`}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-nuziiTextLight">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-normal leading-tight text-nuziiText md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={
                outOfStock
                  ? "text-red-600"
                  : "text-nuziiRoseGoldDark"
              }
            >
              {outOfStock ? "Sold out" : "In stock"}
            </span>
            <span aria-hidden="true" className="text-nuziiTextLight/50">
              ·
            </span>
            <span className="text-nuziiTextLight">
              Shipping calculated at checkout
            </span>
          </div>

          <div className="mt-7 border-t border-nuziiSand pt-7">
            <ProductPurchasePanel product={product} />
          </div>

          {product.description && (
            <div className="mt-8 border-t border-nuziiSand pt-7 text-sm leading-relaxed text-nuziiText prose prose-sm max-w-none">
              <PortableText
                value={product.description}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="mb-3 leading-7">{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h2 className="mb-3 text-2xl font-normal text-nuziiText">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-3 text-xl font-normal text-nuziiText">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-2 text-lg font-normal text-nuziiText">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="mb-2 text-base font-normal text-nuziiText">
                        {children}
                      </h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-2 border-nuziiRoseGold pl-4 italic">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="mb-3 list-inside list-disc space-y-1">
                        {children}
                      </ul>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => <li>{children}</li>,
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-nuziiText">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => <em>{children}</em>,
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        className="underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            </div>
          )}

          <div className="mt-6 border-t border-nuziiSand pt-2">
            <ProductCharacteristics product={product} />
          </div>
          <ProductPageActions product={product} />

          <div className="grid grid-cols-1 border-t border-nuziiSand text-center sm:grid-cols-2">
            <div className="p-4 sm:border-r sm:border-nuziiSand">
              <p className="text-sm font-medium text-nuziiText">Free Shipping</p>
              <p className="mt-1 text-xs text-nuziiTextLight">
                Free shipping over order LKR 120
              </p>
            </div>
            <div className="border-t border-nuziiSand p-4 sm:border-t-0">
              <p className="text-sm font-medium text-nuziiText">
                Flexible Payment
              </p>
              <p className="mt-1 text-xs text-nuziiTextLight">
                Pay with Multiple Credit Cards
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default ProductPage;
