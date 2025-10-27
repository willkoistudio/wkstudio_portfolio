/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectType",
  title: "Project Type",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
    },
  },
});
