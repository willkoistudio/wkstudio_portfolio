/** @format */
import "@/css/globals.scss";
import { Header } from "@/components/app/header/header";
import { Work_Sans } from "next/font/google";
import "@/lib/fontawesome";
import { LocaleProvider } from "@/contexts/locale-context";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={workSans.variable}>
      <body>
        <LocaleProvider>
          <Header />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
