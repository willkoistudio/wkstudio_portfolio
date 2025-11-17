"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./projects.module.scss";
import { ChevronsDown } from "lucide-react";
import { useState, useEffect } from "react";
import { sanity } from "@/lib/sanity.client";
import { projectFiltersQuery } from "@/lib/sanity.queries";

interface ProjectFilter {
  _id: string;
  title: {
    fr?: string;
    en?: string;
  };
}

export default function Projects() {
  const t = useTranslations();
  const locale = useLocale();
  const [filters, setFilters] = useState<ProjectFilter[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await sanity.fetch<ProjectFilter[]>(projectFiltersQuery);
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return (
    <main id="projects">
      <header
        className={`${styles["projects-header"]} flex flex-col justify-center items-center text-center`}
      >
        <div className="container z-1">
          <h1
            className={`${styles["projects-title"]} font-black text-white mb-8`}
          >
            {t("projects.title")}
          </h1>
          <p
            className={`${styles["projects-description"]} text-white mx-auto font-medium`}
          >
            {t("projects.description")}
          </p>
          <ChevronsDown
            className="text-white animate-bounce mx-auto mt-10 cursor-pointer"
            size={32}
            color="white"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
          />
        </div>
      </header>
      <section id="projects-list">
        <div id="projects-list-header">
          <ul id="projects-list-header-filters" className="flex gap-4">
            <li>
              <button
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? styles.active : ""}
              >
                {t("projects.filters.all")}
              </button>
            </li>
            {!loading &&
              filters.map((filter) => (
                <li key={filter._id}>
                  <button
                    onClick={() => setActiveFilter(filter._id)}
                    className={activeFilter === filter._id ? styles.active : ""}
                  >
                    {locale === "en" ? filter.title.en : filter.title.fr}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="container">
          <h2 className="text-2xl font-bold">Projects</h2>
        </div>
      </section>
    </main>
  );
}
