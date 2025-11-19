/** @format */

import { useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";
import { Project } from "@/models/projects";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import styles from "@/app/projects/projects.module.scss";

interface ProjectCardProps {
  project: Project;
}

/**
 * Composant de carte de projet avec animation au scroll
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale();

  /**
   * Gère les événements d'intersection pour les images de section
   */
  const onSectionImageIntersect = useCallback(
    (
      entries: IntersectionObserverEntry[],
      _observer: IntersectionObserver,
      isIntersecting: boolean,
    ) => {
      if (
        isIntersecting &&
        entries.length > 0 &&
        entries[0].target &&
        entries[0].target.classList
      ) {
        try {
          entries[0].target.classList.add("animation-slide-y");
        } catch (error) {
          console.error("Error adding animation class:", error);
        }
      }
    },
    [],
  );

  const elementRef = useIntersectionObserver(onSectionImageIntersect, {
    threshold: 0.1,
    rootMargin: "0px",
    triggerOnce: true,
  });

  return (
    <article ref={elementRef} className={cn(styles.projectCard, "relative")}>
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
              "font-bold text-center",
              `${project.projectFilterType?.className !== "design" ? "text-white" : "text-black"}`,
            )}
          >
            {locale === "en" ? project.title.en : project.title.fr}
          </h3>
        </div>
      </Link>
    </article>
  );
}
