import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      description: "Firebase UID of the signed-in customer. Empty for guest checkouts.",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Customer Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: "line1", title: "Address Line 1", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "line2", title: "Address Line 2", type: "string" }),
        defineField({ name: "city", title: "City", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string", initialValue: "Sri Lanka", validation: (Rule) => Rule.required() }),
      ],
      preview: {
        select: { line1: "line1", city: "city" },
        prepare({ line1, city }) {
          return { title: [line1, city].filter(Boolean).join(", ") };
        },
      },
    }),
    defineField({
      name: "shippingMethod",
      title: "Shipping Method",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: "title", title: "Method", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "cost", title: "Cost", type: "number", validation: (Rule) => Rule.required().min(0) }),
      ],
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      description: "Which payment rail the customer chose at checkout.",
      type: "string",
      options: {
        list: [
          { title: "iPay (card / LankaQR)", value: "ipay" },
          { title: "Cash on Delivery", value: "cod" },
        ],
      },
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      description:
        "Driven automatically by the payment gateway callback — do not edit by hand unless you are reconciling a payment manually.",
      type: "string",
      options: {
        list: [
          { title: "Not required (Cash on Delivery)", value: "not_required" },
          { title: "Awaiting payment", value: "awaiting_payment" },
          { title: "Paid", value: "paid" },
          { title: "Pending settlement", value: "pending_settlement" },
          { title: "Failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "paymentGatewayReference",
      title: "Payment Gateway Reference",
      description: "iPay transactionReference for this order.",
      type: "string",
    }),
    defineField({
      name: "paymentTransactionMessage",
      title: "Payment Message",
      description: "transactionMessage returned by iPay.",
      type: "string",
    }),
    defineField({
      name: "paymentTransactionAmount",
      title: "Payment Transaction Amount",
      description: "Amount iPay reported charging the customer.",
      type: "number",
    }),
    defineField({
      name: "paymentCreditedAmount",
      title: "Payment Credited Amount",
      description:
        "Amount iPay will settle to the merchant account (net of gateway fees).",
      type: "number",
    }),
    defineField({
      name: "paymentCompletedAt",
      title: "Payment Completed At",
      type: "datetime",
    }),
    defineField({
      name: "paymentRawCallback",
      title: "Raw Gateway Callback",
      description: "Verbatim callback body, kept for dispute resolution.",
      type: "text",
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: "paymentNotes",
      title: "Payment Notes",
      description: "Free-text notes for manual reconciliation.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "stockRestored",
      title: "Stock Restored",
      description:
        "Set automatically when a failed payment returned this order's stock to inventory.",
      type: "boolean",
      readOnly: true,
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
            defineField({
              name: "variantColor",
              title: "Color",
              type: "string",
            }),
            defineField({
              name: "variantSize",
              title: "Size",
              type: "string",
            }),
            defineField({
              name: "variantSku",
              title: "SKU",
              type: "string",
            }),
            defineField({
              name: "variantKey",
              title: "Variant Key",
              description:
                "Sanity _key of the purchased variant. Used to return stock to the right variant if the payment fails.",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "productName",
              title: "Product Name",
              description:
                "Name captured at purchase time, so the order still reads correctly if the product is renamed or deleted.",
              type: "string",
            }),
            defineField({
              name: "unitPrice",
              title: "Unit Price Paid",
              description: "Price per unit at purchase time, after discount.",
              type: "number",
            }),
            defineField({
              name: "lineTotal",
              title: "Line Total",
              type: "number",
            }),
          ],
          preview: {
            select: {
              productName: "productName",
              fallbackName: "product.name",
              quantity: "quantity",
              color: "variantColor",
              size: "variantSize",
              image: "product.image",
              lineTotal: "lineTotal",
            },
            prepare(select) {
              const variant = [select.color, select.size]
                .filter(Boolean)
                .join(" / ");
              const name = select.productName ?? select.fallbackName ?? "Product";
              return {
                title: `${name}${variant ? ` (${variant})` : ""} x ${select.quantity}`,
                subtitle:
                  typeof select.lineTotal === "number"
                    ? `${select.lineTotal}`
                    : undefined,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      description: "Sum of line items before discount and shipping.",
      type: "number",
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      description:
        "Internal fulfilment tracker managed by the store. Update it by hand as you process the order — it does not notify the customer automatically.",
      initialValue: "pending",
      options: {
        list: [
          {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Paid",
            value: "paid",
          },
          {
            title: "Shipped",
            value: "shipped",
          },
          {
            title: "Delivered",
            value: "delivered",
          },
          {
            title: "Cancelled",
            value: "cancelled",
          },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      paymentStatus: "paymentStatus",
    },
    prepare(select) {
      const orderId = select.orderId ?? "";
      const orderIdSnippet =
        orderId.length > 12
          ? `${orderId.slice(0, 5)}...${orderId.slice(-5)}`
          : orderId;
      const payment = select.paymentStatus
        ? ` · ${String(select.paymentStatus).replace(/_/g, " ")}`
        : "";
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency}, ${select.email}${payment}`,
        media: BasketIcon,
      };
    },
  },
});
