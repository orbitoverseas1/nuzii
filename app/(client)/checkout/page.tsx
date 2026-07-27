"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/productPricing";
import useCartStore, { getCartLineKey } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { shippingMethods } from "@/constants";
import { createOrder, type PaymentMethod } from "@/actions/createOrder";
import IpayRedirectForm from "@/components/checkout/IpayRedirectForm";
import { CreditCard, Loader2, ShoppingBag, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const paymentOptions: Array<{
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    id: "ipay",
    title: "Pay now with iPay",
    description: "Card, LankaQR, or the iPay app — secure checkout",
    icon: CreditCard,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: Truck,
  },
];

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { resetCart } = useCartStore();
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ipay");
  const [ipayForm, setIpayForm] = useState<{
    actionUrl: string;
    fields: Record<string, string>;
  } | null>(null);
  // `loading` only updates on the next render, which leaves a window where a
  // fast double-tap submits twice. This ref closes it synchronously.
  const submittingRef = useRef(false);

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingMethodId, setShippingMethodId] = useState(
    shippingMethods[0].id
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.displayName || "");
      setEmail((prev) => prev || user.email || "");
    }
  }, [user]);

  useEffect(() => {
    // Don't bounce to /cart while an order is in flight — a Cash on Delivery
    // order empties the cart moments before it navigates to /success.
    if (isClient && groupedItems.length === 0 && !submittingRef.current) {
      router.replace("/cart");
    }
  }, [isClient, groupedItems.length, router]);

  const selectedShippingMethod = useMemo(
    () =>
      shippingMethods.find((method) => method.id === shippingMethodId) ??
      shippingMethods[0],
    [shippingMethodId]
  );

  const discountedTotal = useMemo(
    () =>
      groupedItems.reduce(
        (total, { product, quantity, selectedVariant }) =>
          total +
          getDiscountedPrice(
            selectedVariant?.priceOverride ?? product.price,
            product.discount
          ) *
            quantity,
        0
      ),
    [groupedItems]
  );

  const total = discountedTotal + selectedShippingMethod.cost;

  // Once the iPay form is mounted we are on our way out to the gateway; the
  // cart is deliberately still full in case the customer cancels.
  if (ipayForm) {
    return <IpayRedirectForm {...ipayForm} />;
  }

  if (!isClient || groupedItems.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    try {
      const result = await createOrder({
        // Only *what* is being bought. Prices come from Sanity server-side —
        // the cart lives in localStorage and can say anything.
        lines: groupedItems.map(({ product, quantity, selectedVariant }) => ({
          productId: product._id,
          variantKey: selectedVariant?._key,
          quantity,
        })),
        shippingMethodId: selectedShippingMethod.id,
        paymentMethod,
        expectedTotal: total,
        customerName,
        email,
        phone,
        userId: user?.uid,
        shippingAddress: {
          line1,
          line2: line2 || undefined,
          city,
          postalCode: postalCode || undefined,
          country: "Sri Lanka",
        },
      });

      if (result.kind === "ipay") {
        // Stay in the loading state: this render is replaced by the redirect
        // form, and re-enabling the button would invite a second order.
        setIpayForm({ actionUrl: result.actionUrl, fields: result.fields });
        return;
      }

      if (result.kind === "cod") {
        resetCart();
        router.push(
          `/success?orderNumber=${encodeURIComponent(result.orderNumber)}&t=${encodeURIComponent(result.lookupToken)}`
        );
        return;
      }

      toast.error(result.message);
      if (result.code === "OUT_OF_STOCK" || result.code === "PRICE_CHANGED") {
        router.push("/cart");
        return;
      }
      submittingRef.current = false;
      setLoading(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <Container>
        <div className="flex items-center gap-2 pb-5">
          <ShoppingBag className="h-6 w-6 text-darkColor" />
          <h1 className="text-2xl font-semibold">Checkout</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="space-y-1.5">
                <Label htmlFor="line1">Address Line 1</Label>
                <Input
                  id="line1"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Street address, house number"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="line2">Address Line 2 (optional)</Label>
                <Textarea
                  id="line2"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Apartment, suite, landmark, etc."
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Colombo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode">Postal Code (optional)</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="00100"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input value="Sri Lanka" disabled />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Shipping Method</h2>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-center justify-between gap-4 border rounded-md p-3 cursor-pointer hoverEffect",
                      shippingMethodId === method.id
                        ? "border-darkColor bg-darkColor/5"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={shippingMethodId === method.id}
                        onChange={() => setShippingMethodId(method.id)}
                        className="accent-darkColor"
                      />
                      <div>
                        <p className="font-medium text-sm">{method.title}</p>
                        <p className="text-xs text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <PriceFormatter amount={method.cost} className="font-semibold" />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-3 border rounded-md p-3 cursor-pointer hoverEffect",
                        paymentMethod === option.id
                          ? "border-darkColor bg-darkColor/5"
                          : "border-gray-200"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                        className="accent-darkColor"
                      />
                      <Icon className="w-5 h-5 text-darkColor/70 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{option.title}</p>
                        <p className="text-xs text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {groupedItems.map(({ product, quantity, selectedVariant }) => {
                const variantLabel = [
                  selectedVariant?.color,
                  selectedVariant?.size,
                ]
                  .filter(Boolean)
                  .join(" / ");
                return (
                  <div
                    key={getCartLineKey(product._id, selectedVariant)}
                    className="flex justify-between text-sm gap-2"
                  >
                    <span className="line-clamp-1">
                      {product.name}
                      {variantLabel ? ` (${variantLabel})` : ""}{" "}
                      <span className="text-gray-500">x{quantity}</span>
                    </span>
                    <PriceFormatter
                      amount={
                        getDiscountedPrice(
                          selectedVariant?.priceOverride ?? product.price,
                          product.discount
                        ) * quantity
                      }
                    />
                  </div>
                );
              })}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <PriceFormatter amount={discountedTotal} />
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <PriceFormatter amount={selectedShippingMethod.cost} />
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <PriceFormatter amount={total} className="text-lg font-bold text-black" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full font-semibold tracking-wide"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : paymentMethod === "ipay" ? (
                "Pay Now"
              ) : (
                "Place Order"
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              {paymentMethod === "ipay"
                ? "You'll be redirected to iPay to pay securely by card, LankaQR, or the iPay app."
                : "Pay in cash when your order is delivered — we'll contact you to confirm."}
            </p>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default CheckoutPage;
