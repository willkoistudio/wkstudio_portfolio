/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localeString",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredImage",
      type: "image",
      title: "Featured Image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "localePortableText",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "reference",
      to: [{ type: "projectType" }],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "reference",
      to: [{ type: "projectStatus" }],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "projectTool" }],
        },
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "website",
      title: "Site web",
      type: "string",
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "projectClient" }],
    }),
    defineField({
      name: "slugFr",
      title: "Slug FR",
      type: "slug",
      options: { source: "title.fr" },
    }),
    defineField({
      name: "slugEn",
      title: "Slug EN",
      type: "slug",
      options: { source: "title.en" },
    }),
    defineField({
      name: "projectFilterType",
      title: "Project Filter Type",
      type: "reference",
      to: [{ type: "projectFilter" }],
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
      media: "featuredImage",
      year: "year",
      type: "type.title.fr",
    },
    prepare({ title, media, year, type }) {
      const subtitle = [type, year].filter(Boolean).join(" • ");
      return {
        title,
        media,
        subtitle,
      };
    },
  },
});
