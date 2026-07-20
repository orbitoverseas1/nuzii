import { Product } from "@/sanity.types";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { isProductOutOfStock } from "@/lib/productStock";

const ProductCharacteristics = ({ product }: { product: Product }) => {
  const colors = Array.from(
    new Set((product?.variants ?? []).map((v) => v.color).filter(Boolean))
  );
  const sizes = Array.from(
    new Set((product?.variants ?? []).map((v) => v.size).filter(Boolean))
  );

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold">
          {product?.name}: Characteristics
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          <p className="flex items-center justify-between">
            Brand: <span className="font-semibold tracking-wide">{product?.brand || "Unknown"}</span>
          </p>
          <p className="flex items-center justify-between">
            Collection:{" "}
            <span className="font-semibold tracking-wide">{product?.collection || "N/A"}</span>
          </p>
          <p className="flex items-center justify-between">
            Type:{" "}
            <span className="font-semibold tracking-wide">
              {product?.variant}
            </span>
          </p>
          <p className="flex items-center justify-between">
            Stock:{" "}
            <span className="font-semibold tracking-wide">
              {isProductOutOfStock(product) ? "Out of Stock" : "Available"}
            </span>
          </p>
          {colors.length > 0 && (
            <p className="flex items-center justify-between">
              Colors:{" "}
              <span className="font-semibold tracking-wide">
                {colors.join(", ")}
              </span>
            </p>
          )}
          {sizes.length > 0 && (
            <p className="flex items-center justify-between">
              Sizes:{" "}
              <span className="font-semibold tracking-wide">
                {sizes.join(", ")}
              </span>
            </p>
          )}
          {product?.variantInfo && (
            <p className="flex items-center justify-between">
              Notes:{" "}
              <span className="font-semibold tracking-wide">
                {product?.variantInfo}
              </span>
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
