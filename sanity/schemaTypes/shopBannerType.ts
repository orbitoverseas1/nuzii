import { defineField, defineType } from "sanity";
import { BlockElementIcon } from "@sanity/icons";

export const shopBannerType = defineType({
    name: "shopBanner",
    title: "Shop Promotional Banner",
    type: "document",
    icon: BlockElementIcon,
    fields: [
        defineField({
            name: "title",
            title: "Banner Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description/Tagline",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "image",
            title: "Banner Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "ctaText",
            title: "CTA Button Text",
            type: "string",
            initialValue: "Shop Now",
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "size",
            title: "Banner Size",
            type: "string",
            options: {
                list: [
                    { title: "Large", value: "large" },
                    { title: "Small", value: "small" },
                    { title: "Wide", value: "wide" },
                    { title: "Medium", value: "medium" },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "placement",
            title: "Banner Placement",
            type: "string",
            options: {
                list: [
                    { title: "Promotional Grid - Left", value: "promo-left" },
                    { title: "Promotional Grid - Top Right 1", value: "promo-top-right-1" },
                    { title: "Promotional Grid - Top Right 2", value: "promo-top-right-2" },
                    { title: "Promotional Grid - Bottom Right", value: "promo-bottom-right" },
                    { title: "Mid Page - Left", value: "mid-left" },
                    { title: "Mid Page - Right", value: "mid-right" },
                ],
            },
            validation: (Rule) => Rule.required(),
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
            subtitle: "placement",
            media: "image",
        },
    },
});
