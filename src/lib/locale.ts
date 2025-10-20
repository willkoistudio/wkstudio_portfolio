/** @format */

import { getLocale } from "next-intl/server";
export async function getActiveLocale(): Promise<"fr" | "en"> {
  const l = await getLocale();
  return l === "en" ? "en" : "fr";
}
