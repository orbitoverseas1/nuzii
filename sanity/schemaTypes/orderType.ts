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
      name: "paymentGatewayReference",
      title: "Payment Gateway Reference",
      description: "Transaction/reference ID from the payment gateway once integrated.",
      type: "string",
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
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
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
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency}, ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});
