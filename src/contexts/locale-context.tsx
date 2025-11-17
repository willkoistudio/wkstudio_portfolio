"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";

type Locale = "fr" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const messages = {
  fr: frMessages,
  en: enMessages,
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider messages={messages[locale]} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return context;
}
