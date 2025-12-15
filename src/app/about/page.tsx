"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./about.module.scss";
import { ChevronsDown, AppWindow, Code, ArrowUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Projects() {
  const t = useTranslations();

  return (
    <main id="about">
      <section className="grid grid-cols-2">
        <div className={cn(styles["about-bg-content"])}></div>
        <div className="p-14">
          <h2 className="font-bold text-3xl mb-4">{t("about.title")}</h2>
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{ __html: t.raw("about.description") }}
          />
        </div>
      </section>
    </main>
  );
}
