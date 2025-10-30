/** @format */
import "@/css/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import frMessages from "@/messages/fr.json";
import { Header } from "@/components/app/header/header";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <NextIntlClientProvider messages={frMessages} locale="fr">
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
