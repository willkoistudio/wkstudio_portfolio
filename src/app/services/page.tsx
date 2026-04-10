/** @format */

import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SERVICES_PAGE_ENABLED } from "@/config/features";
import ServicesClient from "./services-client";

export default async function ServicesPage() {
  if (!SERVICES_PAGE_ENABLED) {
    redirect("/");
  }
  setRequestLocale("fr");
  return <ServicesClient />;
}
