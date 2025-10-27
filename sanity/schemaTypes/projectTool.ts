/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectTool",
  title: "Project Tool",
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
