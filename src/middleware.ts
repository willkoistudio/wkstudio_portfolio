/** @format */

import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "never", // ← pas de /fr ni /en dans les URLs
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
