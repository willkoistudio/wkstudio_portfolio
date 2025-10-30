/** @format */

import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  // Récupérer la locale depuis les headers ou utiliser la locale par défaut
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
