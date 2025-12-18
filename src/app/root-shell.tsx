"use client";
/** @format */

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { HeaderWrapper } from "@/components/app/header/header-wrapper";
import { FooterWrapper } from "@/components/app/footer/footer-wrapper";
import { LocaleProvider, type Locale } from "@/contexts/locale-context";
import { usePathname } from "next/navigation";
import { ReCaptchaProvider } from "@/components/recaptcha-provider";
import { Toaster } from "sonner";
import { ArrowUp } from "lucide-react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { cn } from "@/lib/utils";

interface RootShellProps {
  children: ReactNode;
}

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const { isVisible: showScrollToTop, scrollToTop } = useScrollToTop();
  const [resolvedLocale, setResolvedLocale] = useState<Locale>(() =>
    /^\/en(\/|$)/.test(pathname) ? "en" : "fr",
  );

  useEffect(() => {
    const htmlLang =
      typeof document !== "undefined" ? document.documentElement.lang : null;

    if (htmlLang === "en" || htmlLang === "fr") {
      setResolvedLocale(htmlLang);
      return;
    }

    const pathForLocale =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    setResolvedLocale(/^\/en(\/|$)/.test(pathForLocale) ? "en" : "fr");
  }, [pathname]);

  return (
    <>
      <ReCaptchaProvider>
        <LocaleProvider initialLocale={resolvedLocale}>
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
    </>
  );
}
