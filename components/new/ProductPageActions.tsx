"use client";

import { Product } from "@/sanity.types";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = "94762537608";

const ProductPageActions = ({ product }: { product: Product }) => {
  const handleAskQuestion = () => {
    const productUrl = product?.slug?.current
      ? `${window.location.origin}/product/${product.slug.current}`
      : window.location.href;
    const message = `Hi NUZII, I have a question about this product: ${product?.name ?? "Product"}\n${productUrl}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name ?? "NUZII",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share, no-op
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
      <button
        onClick={handleAskQuestion}
        className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect"
      >
        <FaRegQuestionCircle className="text-lg" />
        <p>Ask a question</p>
      </button>
      <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
        <TbTruckDelivery className="text-lg" />
        <p>Delivery & Return</p>
      </div>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect"
      >
        <FiShare2 className="text-lg" />
        <p>Share</p>
      </button>
    </div>
  );
};

export default ProductPageActions;
