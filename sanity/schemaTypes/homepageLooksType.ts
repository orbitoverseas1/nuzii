import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const defaultLookCards = [
  { _key: "essentials", _type: "lookCard", title: "Essentials" },
  { _key: "luxe", _type: "lookCard", title: "Luxe" },
  { _key: "modest-style", _type: "lookCard", title: "Modest Style Edit" },
  { _key: "statement", _type: "lookCard", title: "Statement Pieces" },
];

export const homepageLooksType = defineType({
  name: "homepageLooks",
  title: "Homepage Looks",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "isActive",
      title: "Show Section",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Explore the looks that define Nuzii.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue:
        "Essentials. Luxe. Modest Style Edit. Statement Pieces.\nCurated for women who love simple, elegant, everyday style.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cards",
      title: "Look Cards (4 fixed slots)",
      type: "array",
      description: "Edit the four existing cards. Add or remove cards is not supported.",
      initialValue: defaultLookCards,
      of: [
        defineArrayMember({
          name: "lookCard",
          title: "Look Card",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Card Name",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "alt",
              title: "Image Alt Text",
              type: "string",
              description: "Describe the image for screen readers.",
            }),
            defineField({
              name: "link",
              title: "Optional Link",
              type: "url",
              description:
                "Use a site path such as /shop or /category/bags, or a full https:// URL.",
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
              subtitle: "link",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().length(4),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Looks",
        subtitle: "Explore the looks section",
      };
    },
  },
});
