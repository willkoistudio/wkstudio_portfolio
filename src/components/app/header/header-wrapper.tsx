"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function HeaderWrapper() {
  const pathname = usePathname();

  // Ne pas afficher le Header sur la page /studio
  if (pathname === "/studio") {
    return null;
  }

  return <Header />;
}
