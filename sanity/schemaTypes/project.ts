/** @format */

import { defineType, defineField } from "sanity";
export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "summary", type: "localeText", title: "Summary" }),
    // si tu veux des slugs différents par langue, remplace par un objet localeSlug custom :
    defineField({
      name: "slugFr",
      type: "slug",
      options: { source: "title.fr" },
    }),
    defineField({
      name: "slugEn",
      type: "slug",
      options: { source: "title.en" },
    }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({ name: "date", type: "datetime" }),
    defineField({ name: "tech", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
});
