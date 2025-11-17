"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./projects.module.scss";
import { ChevronsDown, AppWindow, Wallpaper, Code } from "lucide-react";
import { useState, useEffect } from "react";
import { sanity } from "@/lib/sanity.client";
import { allProjectsQuery, projectFiltersQuery } from "@/lib/sanity.queries";
import { cn } from "@/lib/utils";
import { Project, ProjectFilter } from "@/models/projects";
import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";

export default function Projects() {
  const t = useTranslations();
  const locale = useLocale();
  const [filters, setFilters] = useState<ProjectFilter[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
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

    const fetchProjects = async () => {
      try {
        const data = await sanity.fetch<Project[]>(allProjectsQuery);
        setProjects(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
    fetchProjects();
  }, []);

  // Filtrer les projets en fonction du filtre actif
  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter(
          (project) => project.projectFilterType?._id === activeFilter,
        );

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
        <div id="projects-list-header" className="flex w-full mb-6">
          <ul id="projects-list-header-filters" className="flex w-full">
            <li className="flex-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={cn(
                  styles.filterButton,
                  "all",
                  activeFilter === "all" ? "active" : "",
                  "transition-colors uppercase w-full whitespace-nowrap py-6",
                )}
              >
                <span>{t("projects.filters.all")}</span>
              </button>
            </li>
            {!loading &&
              filters.map((filter) => (
                <li key={filter._id} className="flex-1">
                  <button
                    onClick={() => setActiveFilter(filter._id)}
                    className={cn(
                      styles.filterButton,
                      filter.className,
                      activeFilter === filter._id ? "active" : "",
                      "transition-colors uppercase w-full whitespace-nowrap py-6",
                    )}
                  >
                    <span>
                      {filter.className === "ux" ? (
                        <AppWindow
                          size={24}
                          color={
                            activeFilter === filter._id ? "white" : filter.color
                          }
                          className="mr-2 inline-block relative bottom-[2px]"
                        />
                      ) : filter.className === "web" ? (
                        <Code
                          size={24}
                          color={
                            activeFilter === filter._id ? "white" : filter.color
                          }
                          className="mr-2 inline-block relative bottom-[2px]"
                        />
                      ) : filter.className === "design" ? (
                        <Wallpaper
                          size={24}
                          color={
                            activeFilter === filter._id
                              ? "var(--text-base)"
                              : filter.color
                          }
                          className="mr-2 inline-block relative bottom-[2px]"
                        />
                      ) : null}
                      {locale === "en" ? filter.title.en : filter.title.fr}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="container">
          <Masonry
            breakpointCols={{
              default: 3,
              1200: 2,
              768: 1,
            }}
            className={cn(styles.projectsGrid, "mt-16")}
            columnClassName={styles.projectsGridColumn}
          >
            {filteredProjects.map((project) => (
              <article
                key={project._id}
                className={cn(styles.projectCard, "relative")}
              >
                <Link href={`/projects/${project.slugFr || project.slugEn}`}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.featuredImage}
                      alt={project.title.fr || project.title.en || ""}
                      width={project.featuredImageWidth || 600}
                      height={project.featuredImageHeight || 800}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.projectImage}
                    />
                  </div>
                  <div
                    className={cn(
                      styles.projectInfo,
                      `absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${project.projectFilterType?.className}`,
                    )}
                  >
                    <h3
                      className={cn(
                        styles.projectTitle,
                        "text-white font-bold text-center",
                      )}
                    >
                      {locale === "en" ? project.title.en : project.title.fr}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </Masonry>
        </div>
      </section>
    </main>
  );
}
