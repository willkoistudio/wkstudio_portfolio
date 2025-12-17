/** @format */

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import styles from "./app.module.scss";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <main>
      <div>
        <div
          className={cn(styles["not-found-container"], "w-full flex flex-col")}
        >
          <div className="py-12 text-white text-center mb-0 mt-auto">
            <h1 className="text-4xl font-black mb-4">{t("404.title")}</h1>
            <p className="text-white font-medium">{t("404.description")}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-3xl hover:bg-primary-foreground transition-colors !text-white !no-underline"
            >
              {t("404.button")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
