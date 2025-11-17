"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function FooterWrapper() {
  const pathname = usePathname();

  // Ne pas afficher le Header sur la page /studio
  if (pathname === "/studio" || pathname === "/") {
    return null;
  }

  return <Footer />;
}
