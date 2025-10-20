/** @format */

import { defineType, defineField } from "sanity";
export default defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "string", title: "Français" }),
    defineField({ name: "en", type: "string", title: "English" }),
  ],
});
