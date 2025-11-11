/** @format */
import "@/css/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import frMessages from "@/messages/fr.json";
import { Header } from "@/components/app/header/header";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={workSans.variable}>
      <body>
        <NextIntlClientProvider messages={frMessages} locale="fr">
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
