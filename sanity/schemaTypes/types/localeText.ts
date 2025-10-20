/** @format */

import { defineType, defineField } from "sanity";
export default defineType({
  name: "localeText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "text", title: "Français" }),
    defineField({ name: "en", type: "text", title: "English" }),
  ],
});
