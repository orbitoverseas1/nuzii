import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const productReferenceArray = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [{ type: "reference", to: [{ type: "product" }] }],
    options: { sortable: true },
    validation: (Rule) => Rule.max(12),
  });

export const homepageProductSectionsType = defineType({
  name: "homepageProductSections",
  title: "Homepage Product Sections",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    productReferenceArray(
      "mostLoved",
      "Most Loved Products",
      "Select up to 12 products and drag them into the exact homepage order."
    ),
    productReferenceArray(
      "freshDrops",
      "Fresh Drops Products",
      "Select up to 12 products and drag them into the exact homepage order."
    ),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Product Sections",
        subtitle: "Most Loved and Fresh Drops",
      };
    },
  },
});
