"use client";
/** @format */
import "@/css/globals.scss";
import { HeaderWrapper } from "@/components/app/header/header-wrapper";
import { Work_Sans } from "next/font/google";
import "@/lib/fontawesome";
import { LocaleProvider } from "@/contexts/locale-context";
import { FooterWrapper } from "@/components/app/footer/footer-wrapper";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { ReCaptchaProvider } from "@/components/recaptcha-provider";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="fr" className={workSans.variable}>
      <body>
        <ReCaptchaProvider>
          <LocaleProvider>
            {!pathname.startsWith("/studio") && <HeaderWrapper />}
            {children}
            {!pathname.startsWith("/studio") && <FooterWrapper />}
          </LocaleProvider>
          <Toaster />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
