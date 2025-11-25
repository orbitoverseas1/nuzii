import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "intro",
      title: "Product Intro",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Tshirt", value: "tshirt" },
          { title: "Jacket", value: "jacket" },
          { title: "Pants", value: "pants" },
          { title: "Hoodie", value: "hoodie" },
          { title: "Short", value: "short" },
          { title: "Others", value: "others" },
        ],
      },
    }),
    defineField({
      name: "isBestSelling",
      title: "Best Selling",
      type: "boolean",
      description: "Mark as best selling product",
      initialValue: false,
    }),
    defineField({
      name: "isTopRated",
      title: "Top Rated",
      type: "boolean",
      description: "Mark as top rated product",
      initialValue: false,
    }),
    defineField({
      name: "rating",
      title: "Product Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
      description: "Rating from 0 to 5",
    }),
    defineField({
      name: "salesCount",
      title: "Sales Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description: "Total number of sales (for sorting best sellers)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
