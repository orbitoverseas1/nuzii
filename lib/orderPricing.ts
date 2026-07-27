import "server-only";
import { backendClient } from "@/sanity/lib/backendClient";
import { getDiscountedPrice } from "@/lib/productPricing";
import { shippingMethods } from "@/constants";

/**
 * Authoritative order pricing.
 *
 * The cart lives in localStorage and holds whole Sanity product documents,
 * price included, so anything the browser sends about money is a suggestion at
 * best. The checkout therefore sends only *what* is being bought — product id,
 * variant key, quantity — and every rupee is recomputed here from Sanity.
 *
 * Reads go through `backendClient` (not the public `client`): that one has
 * stega enabled, which splices invisible characters into every string it
 * returns. Those characters would end up in the payment checksum and in the
 * stored order.
 */

export interface CheckoutLineInput {
  productId: string;
  variantKey?: string;
  quantity: number;
}

export interface PricedLine {
  productId: string;
  productName: string;
  variantKey?: string;
  variantColor?: string;
  variantSize?: string;
  variantSku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Pre-discount unit price, kept so the order can show what was saved. */
  baseUnitPrice: number;
  /** Whether stock is tracked on the variant or on the product document. */
  hasTrackedStock: boolean;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotal: number;
  amountDiscount: number;
  discountedTotal: number;
  shippingMethod: { id: string; title: string; cost: number };
  totalPrice: number;
  itemCount: number;
}

export type PricingErrorCode = "INVALID_CART" | "OUT_OF_STOCK";

export class OrderPricingError extends Error {
  code: PricingErrorCode;
  constructor(code: PricingErrorCode, message: string) {
    super(message);
    this.name = "OrderPricingError";
    this.code = code;
  }
}

const MAX_LINE_QUANTITY = 50;

/** Money in this store is whole rupees and cents; compare it as integers. */
export const toCents = (amount: number): number => Math.round(amount * 100);

const PRODUCTS_FOR_PRICING_QUERY = `*[_type == "product" && _id in $ids]{
  _id,
  name,
  price,
  discount,
  stock,
  variants[]{ _key, color, size, sku, stock, priceOverride }
}`;

interface PricingProduct {
  _id: string;
  name?: string;
  price?: number;
  discount?: number;
  stock?: number;
  variants?: Array<{
    _key: string;
    color?: string;
    size?: string;
    sku?: string;
    stock?: number;
    priceOverride?: number;
  }>;
}

export const priceOrder = async (
  lines: CheckoutLineInput[],
  shippingMethodId: string
): Promise<PricedOrder> => {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new OrderPricingError("INVALID_CART", "Your cart is empty.");
  }

  const shippingMethod = shippingMethods.find((m) => m.id === shippingMethodId);
  if (!shippingMethod) {
    throw new OrderPricingError(
      "INVALID_CART",
      "Please choose a valid delivery method."
    );
  }

  // Collapse duplicate lines so the same variant cannot be submitted twice to
  // slip past the stock check one line at a time.
  const merged = new Map<string, CheckoutLineInput>();
  for (const line of lines) {
    if (!line?.productId || typeof line.productId !== "string") {
      throw new OrderPricingError("INVALID_CART", "Your cart contains an invalid item.");
    }
    if (
      typeof line.quantity !== "number" ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_LINE_QUANTITY
    ) {
      throw new OrderPricingError(
        "INVALID_CART",
        `Quantities must be between 1 and ${MAX_LINE_QUANTITY}.`
      );
    }
    const key = `${line.productId}::${line.variantKey ?? ""}`;
    const existing = merged.get(key);
    merged.set(
      key,
      existing
        ? { ...existing, quantity: existing.quantity + line.quantity }
        : { ...line }
    );
  }

  const mergedLines = [...merged.values()];
  const ids = [...new Set(mergedLines.map((l) => l.productId))];

  const products: PricingProduct[] = await backendClient.fetch(
    PRODUCTS_FOR_PRICING_QUERY,
    { ids }
  );
  const byId = new Map(products.map((p) => [p._id, p]));

  const pricedLines: PricedLine[] = mergedLines.map((line) => {
    const product = byId.get(line.productId);
    if (!product) {
      throw new OrderPricingError(
        "INVALID_CART",
        "An item in your cart is no longer available. Please review your cart."
      );
    }

    const variant = line.variantKey
      ? product.variants?.find((v) => v._key === line.variantKey)
      : undefined;

    if (line.variantKey && !variant) {
      throw new OrderPricingError(
        "INVALID_CART",
        `The selected option for "${product.name ?? "an item"}" is no longer available.`
      );
    }

    // A variant product must be bought as a specific variant — otherwise stock
    // cannot be decremented against anything meaningful.
    if (!line.variantKey && (product.variants?.length ?? 0) > 0) {
      throw new OrderPricingError(
        "INVALID_CART",
        `Please choose an option for "${product.name ?? "an item"}".`
      );
    }

    // Mirrors lib/productStock.ts#getAvailableStock, but against this query's
    // narrow projection rather than a full Product document.
    const available = variant
      ? (variant.stock ?? 0)
      : (product.stock ?? 0);
    if (available < line.quantity) {
      throw new OrderPricingError(
        "OUT_OF_STOCK",
        available > 0
          ? `Only ${available} left of "${product.name ?? "an item"}".`
          : `"${product.name ?? "An item"}" just sold out.`
      );
    }

    const baseUnitPrice = variant?.priceOverride ?? product.price ?? 0;
    const unitPrice = getDiscountedPrice(baseUnitPrice, product.discount);

    if (!(unitPrice > 0)) {
      throw new OrderPricingError(
        "INVALID_CART",
        `"${product.name ?? "An item"}" is not available for online purchase.`
      );
    }

    return {
      productId: product._id,
      productName: product.name ?? "Product",
      variantKey: line.variantKey,
      variantColor: variant?.color,
      variantSize: variant?.size,
      variantSku: variant?.sku,
      quantity: line.quantity,
      unitPrice,
      lineTotal: unitPrice * line.quantity,
      baseUnitPrice,
      hasTrackedStock: Boolean(variant) || typeof product.stock === "number",
    };
  });

  const subtotal = pricedLines.reduce(
    (total, line) => total + line.baseUnitPrice * line.quantity,
    0
  );
  const discountedTotal = pricedLines.reduce(
    (total, line) => total + line.lineTotal,
    0
  );

  return {
    lines: pricedLines,
    subtotal,
    amountDiscount: subtotal - discountedTotal,
    discountedTotal,
    shippingMethod: {
      id: shippingMethod.id,
      title: shippingMethod.title,
      cost: shippingMethod.cost,
    },
    totalPrice: discountedTotal + shippingMethod.cost,
    itemCount: pricedLines.reduce((count, line) => count + line.quantity, 0),
  };
};
