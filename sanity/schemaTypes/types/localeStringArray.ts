/** @format */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "localeStringArray",
  title: "Localized String List",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
