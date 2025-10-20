/** @format */

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Interface de gestion de contenu pour WK Studio.",
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
