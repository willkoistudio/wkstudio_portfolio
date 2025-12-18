/** @format */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["fr", "en"] as const;
const DEFAULT_LOCALE = "fr";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeFromPath = pathname.match(/^\/(fr|en)(\/|$)/)?.[1];
  const locale = SUPPORTED_LOCALES.includes(
    localeFromPath as (typeof SUPPORTED_LOCALES)[number],
  )
    ? (localeFromPath as (typeof SUPPORTED_LOCALES)[number])
    : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|studio).*)"],
};

