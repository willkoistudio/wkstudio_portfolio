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
import { ArrowUp } from "lucide-react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { cn } from "@/lib/utils";

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
  const { isVisible: showScrollToTop, scrollToTop } = useScrollToTop();

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
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-4 right-4 px-4 py-4 rounded-full bg-primary hover:bg-primary-foreground transition-opacity duration-400 ease-in-out z-50",
            showScrollToTop
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} color="white" />
        </button>
      </body>
    </html>
  );
}
