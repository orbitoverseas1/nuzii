"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { Order, Product } from "@/sanity.types";

const ORDER_BY_NUMBER_QUERY = defineQuery(`
  *[_type == 'order' && orderNumber == $orderNumber][0]{
    ...,
    products[]{
      ...,product->
    }
  }
`);

type OrderWithExpandedProducts = Omit<Order, "products"> & {
  products?: Array<{
    _key: string;
    quantity?: number;
    variantColor?: string;
    variantSize?: string;
    product?: Product;
  }>;
};

const SuccessPage = () => {
  const [order, setOrder] = useState<OrderWithExpandedProducts | null>(null);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      try {
        const orderData = await client.fetch(ORDER_BY_NUMBER_QUERY, {
          orderNumber,
        });
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <Check className="text-white w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed!
        </h1>
        <div className="space-y-4 mb-8 text-left">
          <p className="text-gray-700">
            Thank you for your order. We&apos;ll contact you shortly to
            confirm the details and arrange payment on delivery.
          </p>
          <p className="text-gray-700">
            Order Number:{" "}
            <span className="text-black font-semibold">{orderNumber}</span>
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-left space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Order Summary</h2>
              <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full capitalize">
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              {order.products?.map((item) => {
                const variantLabel = [item.variantColor, item.variantSize]
                  .filter(Boolean)
                  .join(" / ");
                return (
                  <div key={item._key} className="flex justify-between">
                    <span className="line-clamp-1">
                      {item.product?.name}
                      {variantLabel ? ` (${variantLabel})` : ""}{" "}
                      <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            {order.shippingAddress && (
              <p className="text-sm text-gray-700">
                Shipping to: {order.shippingAddress.line1}
                {order.shippingAddress.line2
                  ? `, ${order.shippingAddress.line2}`
                  : ""}
                , {order.shippingAddress.city}
              </p>
            )}
            {order.shippingMethod && (
              <p className="text-sm text-gray-700">
                Shipping method: {order.shippingMethod.title}
              </p>
            )}
            <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <PriceFormatter amount={order.totalPrice} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
