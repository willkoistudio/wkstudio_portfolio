/** @format */
import "@/css/globals.scss";
import "@/lib/fontawesome";
import { Work_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { RootShell } from "./root-shell";
import type { Locale } from "@/contexts/locale-context";
import { getLocale } from "next-intl/server";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await getLocale()) as Locale;

  return (
    <html lang={locale} className={workSans.variable}>
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
