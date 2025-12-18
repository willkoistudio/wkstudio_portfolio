/** @format */

import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import styles from "../../app.module.scss";
import { cn } from "@/lib/utils";

export default async function ProjectNotFound() {
  const t = await getTranslations();
  const locale = await getLocale();
  const homeHref = locale === "fr" ? "/" : `/${locale}`;

  return (
    <main>
      <div>
        <div
          className={cn(styles["not-found-container"], "w-full flex flex-col")}
        >
          <div className="py-12 text-white text-center mb-0 mt-auto">
            <h1 className="text-4xl font-black mb-4">
              {t("projects.notFound.title")}
            </h1>
            <p className="text-white font-medium">
              {t("projects.notFound.description")}
            </p>
            <Link
              href={homeHref}
              className="inline-block px-6 py-3 bg-primary text-white rounded-3xl hover:bg-primary-foreground transition-colors !text-white !no-underline"
            >
              {t("projects.notFound.button")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
