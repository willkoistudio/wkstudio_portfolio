/** @format */

import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SERVICES_PAGE_ENABLED } from "@/config/features";
import ServicesClient from "../../services/services-client";

interface LocaleServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleServicesPage({
  params,
}: LocaleServicesPageProps) {
  const { locale } = await params;

  if (!SERVICES_PAGE_ENABLED) {
    redirect(locale === "fr" ? "/" : `/${locale}`);
  }

  setRequestLocale(locale);
  return <ServicesClient />;
}
