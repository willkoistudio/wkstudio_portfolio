/** @format */

import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const SUPPORTED_LOCALES = ["fr", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const candidate = await requestLocale;
  const headersList = await headers();
  const headerLocale =
    headersList.get("x-next-intl-locale") ||
    headersList.get("x-locale") ||
    headersList.get("X-NEXT-INTL-LOCALE");

  const locale = SUPPORTED_LOCALES.includes(
    (candidate ?? headerLocale) as (typeof SUPPORTED_LOCALES)[number],
  )
    ? ((candidate ?? headerLocale) as (typeof SUPPORTED_LOCALES)[number])
    : "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
