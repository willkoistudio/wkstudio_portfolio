/** @format */

import { defineField, defineType } from "sanity";

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990;
  const years = [];

  for (let year = currentYear; year >= startYear; year--) {
    const label = year.toString();
    years.push({ title: label, value: label });
  }

  return years;
};

export default defineType({
  name: "highlightedExperience",
  title: "Highlighted Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "from",
      title: "From",
      type: "string",
      options: {
        list: generateYearOptions(),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to",
      title: "To",
      type: "object",
      options: {
        columns: 2,
      },
      fields: [
        defineField({
          name: "year",
          title: "Year",
          type: "string",
          options: {
            list: [
              { title: "Present", value: "present" },
              ...generateYearOptions(),
            ],
          },
        }),
      ],
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return "Provide a year or a custom label.";
          if (value.year) {
            return true;
          }
          return "Provide a year value.";
        }),
    }),
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [{ type: "string" }],
      description: "List the clients related to this experience.",
    }),
  ],
  preview: {
    select: {
      company: "company",
      positionFr: "position.fr",
      positionEn: "position.en",
      from: "from",
      toYear: "to.year",
      media: "logo",
    },
    prepare({
      company,
      positionFr,
      positionEn,
      from,
      toYear,
      media,
    }) {
      const title = company || "Experience";
      const position = positionFr || positionEn;
      const subtitleParts = [
        position,
        [from, toYear].filter(Boolean).join(" - "),
      ].filter(Boolean);

      return {
        title,
        subtitle: subtitleParts.join(" • "),
        media,
      };
    },
  },
});
