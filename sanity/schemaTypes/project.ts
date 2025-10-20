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
      type: "localeString",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "localeString",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "localeStringArray",
    }),
    defineField({
      name: "website",
      title: "Site web",
      type: "string",
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
      media: "featuredImage",
      subtitle: "year",
    },
  },
});
