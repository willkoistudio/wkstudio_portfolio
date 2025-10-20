/** @format */

import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a default locale
  const locale = "fr";

  return {
    locale,
    messages: {},
  };
});
