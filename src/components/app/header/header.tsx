/** @format */

"use client";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations();
  return <nav>{t("nav.projects")}</nav>;
}
