/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectFilter",
  title: "Project Filter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "#16A4E0" },
          { title: "Green", value: "#1AE016" },
          { title: "Yellow", value: "#E0B516" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "className",
      title: "Class Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
    },
  },
});
