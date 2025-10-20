/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "localePortableText",
  title: "Localized Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
});
