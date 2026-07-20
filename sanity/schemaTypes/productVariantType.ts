import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productVariantType = defineType({
  name: "productVariant",
  title: "Variant",
  type: "object",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "e.g. Rose Gold, Black",
    }),
    defineField({
      name: "colorHex",
      title: "Color Swatch (hex)",
      type: "string",
      description: "Optional hex code shown as a swatch, e.g. #C08497",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: "e.g. S, M, L or One Size",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "priceOverride",
      title: "Price Override",
      description: "Leave empty to use the product's base price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "images",
      title: "Variant Images",
      description: "Optional — overrides the product's main images for this variant",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      color: "color",
      size: "size",
      stock: "stock",
      media: "images.0",
    },
    prepare({ color, size, stock, media }) {
      const title = [color, size].filter(Boolean).join(" / ") || "Variant";
      return {
        title,
        subtitle: `Stock: ${stock ?? 0}`,
        media,
      };
    },
  },
});
