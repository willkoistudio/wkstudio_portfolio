/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectClient",
  title: "Client",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
    },
  },
});
