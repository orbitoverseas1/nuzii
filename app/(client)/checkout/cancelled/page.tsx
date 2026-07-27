import { AlertCircle, Home, RotateCcw, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { getCustomerOrderView } from "@/lib/orderView";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ orderNumber?: string; t?: string }>;
}

/**
 * Where iPay sends a customer who cancelled, or where we send one whose payment
 * was declined.
 *
 * This page never writes to the order. The browser doesn't get to decide that a
 * payment failed — the order stays "awaiting payment" until iPay's callback
 * says otherwise or a human reconciles it.
 */
const CancelledPage = async ({ searchParams }: Props) => {
  const { orderNumber, t } = await searchParams;
  const order = await getCustomerOrderView(orderNumber, t);

  const wasDeclined = order?.paymentStatus === "failed";

  return (
    <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center">
        <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <AlertCircle className="text-white w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment not completed
        </h1>

        <div className="space-y-4 mb-8 text-left">
          <p className="text-gray-700">
            {wasDeclined
              ? "Your payment was declined by your bank, so we haven't charged you. You can try again with a different card, or choose Cash on Delivery."
              : "Your payment wasn't completed, so you have not been charged. You can pick up right where you left off."}
          </p>
          {order?.orderNumber && (
            <p className="text-gray-700">
              Order Number:{" "}
              <span className="text-black font-semibold">
                {order.orderNumber}
              </span>
            </p>
          )}
          <p className="text-gray-600 text-sm">
            Your cart is still saved — nothing has been lost.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/checkout"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try again
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View cart
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center mt-6 text-sm text-gray-500 hover:text-black"
        >
          <Home className="w-4 h-4 mr-1.5" />
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default CancelledPage;
