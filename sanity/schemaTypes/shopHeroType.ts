import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const shopHeroType = defineType({
    name: "shopHero",
    title: "Shop Hero Section",
    type: "document",
    icon: ImageIcon,
    fields: [
        defineField({
            name: "seasonTitle",
            title: "Season/Collection Title",
            type: "string",
            description: "E.g., 'New Arrivals', 'Spring Collection 2024'",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "mainHeading",
            title: "Main Heading",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "primaryButtonText",
            title: "Primary Button Text",
            type: "string",
            initialValue: "Shop Now",
        }),
        defineField({
            name: "primaryButtonLink",
            title: "Primary Button Link",
            type: "string",
            initialValue: "/shop",
        }),
        defineField({
            name: "secondaryButtonText",
            title: "Secondary Button Text",
            type: "string",
        }),
        defineField({
            name: "secondaryButtonLink",
            title: "Secondary Button Link",
            type: "string",
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first (for carousel)",
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
            title: "seasonTitle",
            subtitle: "mainHeading",
            media: "heroImage",
        },
    },
});
