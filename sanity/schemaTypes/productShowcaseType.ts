import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

export const productShowcaseType = defineType({
    name: "productShowcase",
    title: "Product Showcase Section",
    type: "document",
    icon: TagsIcon,
    fields: [
        defineField({
            name: "title",
            title: "Section Title",
            type: "string",
            description: "E.g., 'Seasonal Picks', 'Limited Offers', 'Trending Now'",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subtitle",
            title: "Subtitle",
            type: "string",
        }),
        defineField({
            name: "products",
            title: "Featured Products",
            type: "array",
            of: [{ type: "reference", to: { type: "product" } }],
            validation: (Rule) => Rule.required().min(1).max(4),
            description: "Select up to 4 products to showcase",
        }),
        defineField({
            name: "backgroundColor",
            title: "Background Color",
            type: "string",
            options: {
                list: [
                    { title: "Rose Gold", value: "rose-gold" },
                    { title: "Beige", value: "beige" },
                    { title: "Cream", value: "cream" },
                    { title: "Sand", value: "sand" },
                    { title: "White", value: "white" },
                ],
            },
            initialValue: "cream",
        }),
        defineField({
            name: "ctaText",
            title: "CTA Button Text",
            type: "string",
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "string",
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "subtitle",
        },
    },
});
