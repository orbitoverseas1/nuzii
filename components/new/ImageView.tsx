"use client";

import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductImage {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
  _key: string;
}

interface Props {
  images?: ProductImage[];
  productName?: string;
}

const ImageView = ({ images = [], productName = "Product" }: Props) => {
  const [active, setActive] = useState(images[0]);

  if (!active) return null;

  return (
    <div className="w-full min-w-0 lg:w-[62%]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="group relative aspect-[4/5] w-full overflow-hidden bg-nuziiCream sm:aspect-square"
        >
          <Image
            src={urlFor(active).width(1500).height(1500).fit("crop").url()}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none lg:group-hover:scale-[1.03]"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:mt-4">
          {images.map((image, index) => (
            <button
              key={image._key}
              type="button"
              onClick={() => setActive(image)}
              aria-label={`Show product image ${index + 1}`}
              aria-current={active._key === image._key ? "true" : undefined}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden border transition-colors md:w-24 ${
                active._key === image._key
                  ? "border-nuziiRoseGoldDark"
                  : "border-transparent hover:border-nuziiRoseGold"
              }`}
            >
              <Image
                src={urlFor(image).width(240).height(240).fit("crop").url()}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageView;
