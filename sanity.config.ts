/** @format */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { createUnpublishAction } from "./sanity/plugins/revertToDraftAction";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Portfolio CMS",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) => {
      const unpublish = createUnpublishAction(context);
      return [...prev, unpublish];
    },
  },
});
