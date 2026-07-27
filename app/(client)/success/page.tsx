import PriceFormatter from "@/components/PriceFormatter";
import { Check, Clock, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCustomerOrderView } from "@/lib/orderView";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import OrderStatusPoller from "@/components/checkout/OrderStatusPoller";

// A payment callback can land moments before the customer does, so this page
// must never be cached.
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ orderNumber?: string; t?: string }>;
}

const NotFoundCard = () => (
  <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        We couldn&apos;t find that order
      </h1>
      <p className="text-gray-600">
        This link may have expired or been copied incompletely. Check the link in
        your confirmation email, or contact us and we&apos;ll help you out.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to shop
      </Link>
    </div>
  </div>
);

const SuccessPage = async ({ searchParams }: Props) => {
  const { orderNumber, t } = await searchParams;
  const order = await getCustomerOrderView(orderNumber, t);

  // Don't distinguish "wrong token" from "no such order" — either way the
  // caller learns nothing about which order numbers exist.
  if (!order) return <NotFoundCard />;

  const paymentStatus = order.paymentStatus ?? "not_required";

  // A payment that failed or was cancelled belongs on the cancel page, which
  // explains what happened and keeps the cart.
  if (paymentStatus === "failed" || paymentStatus === "cancelled") {
    redirect(
      `/checkout/cancelled?orderNumber=${encodeURIComponent(order.orderNumber)}&t=${encodeURIComponent(t ?? "")}`
    );
  }

  const isSettled =
    paymentStatus === "paid" ||
    paymentStatus === "pending_settlement" ||
    paymentStatus === "not_required";
  const isAwaiting = paymentStatus === "awaiting_payment";

  const heading = isAwaiting
    ? "Confirming your payment…"
    : paymentStatus === "paid"
      ? "Payment successful!"
      : paymentStatus === "pending_settlement"
        ? "Order confirmed"
        : "Order placed!";

  const intro = isAwaiting
    ? "We're waiting for your bank to confirm this payment. This page will update on its own — please don't close it."
    : paymentStatus === "paid"
      ? "Thank you for your order. We've received your payment and we're getting it ready to ship."
      : paymentStatus === "pending_settlement"
        ? "Thank you for your order. Your payment has gone through and we're just waiting on final confirmation from your bank."
        : "Thank you for your order. We'll contact you shortly to confirm the details and arrange payment on delivery.";

  return (
    <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Only clear the cart once we know the order is real and settled. */}
      {isSettled && <ClearCartOnSuccess />}
      {isAwaiting && (
        <OrderStatusPoller orderNumber={order.orderNumber} token={t ?? ""} />
      )}

      <div className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg ${
            isAwaiting ? "bg-amber-500" : "bg-black"
          }`}
        >
          {isAwaiting ? (
            <Clock className="text-white w-12 h-12 animate-pulse" />
          ) : (
            <Check className="text-white w-12 h-12" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h1>
        <div className="space-y-4 mb-8 text-left">
          <p className="text-gray-700">{intro}</p>
          <p className="text-gray-700">
            Order Number:{" "}
            <span className="text-black font-semibold">
              {order.orderNumber}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
            <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full capitalize">
              {paymentStatus.replace(/_/g, " ")}
            </span>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            {order.lines?.map((item) => {
              const variantLabel = [item.variantColor, item.variantSize]
                .filter(Boolean)
                .join(" / ");
              return (
                <div key={item._key} className="flex justify-between gap-2">
                  <span className="line-clamp-1">
                    {item.productName}
                    {variantLabel ? ` (${variantLabel})` : ""}{" "}
                    <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <PriceFormatter amount={item.lineTotal} />
                </div>
              );
            })}
          </div>
          {order.shippingCity && (
            <p className="text-sm text-gray-700">
              Shipping to: {order.shippingCity}
            </p>
          )}
          {order.shippingMethodTitle && (
            <p className="text-sm text-gray-700">
              Shipping method: {order.shippingMethodTitle}
            </p>
          )}
          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <PriceFormatter amount={order.totalPrice} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          {/* Account feature temporarily hidden — restore when the client wants it back.
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>
          */}
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
