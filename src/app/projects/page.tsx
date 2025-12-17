"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./projects.module.scss";
import {
  ChevronsDown,
  AppWindow,
  Wallpaper,
  Code,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { sanity } from "@/lib/sanity.client";
import { allProjectsQuery, projectFiltersQuery } from "@/lib/sanity.queries";
import { cn } from "@/lib/utils";
import { Project, ProjectFilter } from "@/models/projects";
import Masonry from "react-masonry-css";
import { ProjectCard } from "@/components/app/projects/project-card";
import { useSticky } from "@/hooks/use-sticky";

export default function Projects() {
  const t = useTranslations();
  const locale = useLocale();
  const [filters, setFilters] = useState<ProjectFilter[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const filtersRef = useRef<HTMLDivElement>(null);
  const isSticky = useSticky(filtersRef);

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

  const scrollToMainContent = () => {
    const projectsList = document.getElementById("projects-list");
    if (projectsList) {
      projectsList.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const updateFilters = (filterId: string) => {
    scrollToMainContent();

    setActiveFilter(filterId);
  };

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
            onClick={scrollToMainContent}
          />
        </div>
      </header>
      <section id="projects-list" className="pt-10 lg:pt-16 pb-12">
        <div className="container !px-10">
          {/* Filters */}
          <div
            ref={filtersRef}
            className={cn(
              "flex mb-6 rounded-lg overflow-hidden sticky top-25 z-10",
              styles.filtersSticky,
              isSticky && styles.isSticky,
            )}
          >
            <ul
              id={styles["projects-list-header-filters"]}
              className="flex !mx-auto w-full"
            >
              <li className="flex-1">
                <button
                  onClick={() => updateFilters("all")}
                  className={cn(
                    styles.filterButton,
                    "all",
                    activeFilter === "all" ? "active" : "",
                    "transition-colors uppercase w-full whitespace-nowrap py-6 px-10",
                  )}
                >
                  <span>{t("projects.filters.all")}</span>
                </button>
              </li>
              {!loading &&
                filters.map((filter) => (
                  <li key={filter._id} className="flex-1">
                    <button
                      onClick={() => updateFilters(filter._id)}
                      className={cn(
                        styles.filterButton,
                        filter.className,
                        activeFilter === filter._id ? "active" : "",
                        "transition-colors uppercase w-full whitespace-nowrap py-6 px-10",
                      )}
                    >
                      <span>
                        {filter.className === "ux" ? (
                          <AppWindow
                            size={24}
                            color={
                              activeFilter === filter._id
                                ? "white"
                                : filter.color
                            }
                            className="mr-2 inline-block relative bottom-[2px]"
                          />
                        ) : filter.className === "web" ? (
                          <Code
                            size={24}
                            color={
                              activeFilter === filter._id
                                ? "white"
                                : filter.color
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
                        <span className="hidden md:inline">
                          {locale === "en" ? filter.title.en : filter.title.fr}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Projects */}
          <Masonry
            breakpointCols={{
              default: 3,
              1024: 2,
              768: 1,
            }}
            className={cn(styles.projectsGrid, "md:mt-6 lg:mt-16")}
            columnClassName={styles.projectsGridColumn}
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </Masonry>
        </div>
      </section>
    </main>
  );
}
