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
import { createOrder } from "@/actions/createOrder";
import { Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { getSubTotalPrice, resetCart } = useCartStore();
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (isClient && groupedItems.length === 0) {
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

  if (!isClient || groupedItems.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { orderNumber } = await createOrder(groupedItems, {
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
        shippingMethod: {
          title: selectedShippingMethod.title,
          cost: selectedShippingMethod.cost,
        },
      });
      resetCart();
      router.push(`/success?orderNumber=${orderNumber}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
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
              ) : (
                "Place Order"
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Payment is collected on delivery for now &mdash; you&apos;ll be
              contacted to confirm your order.
            </p>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default CheckoutPage;
