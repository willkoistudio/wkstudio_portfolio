/** @format */

import { sanity } from "@/lib/sanity.client";
import { projectBySlugQuery } from "@/lib/sanity.queries";
import { Project } from "@/models/projects";
import { getActiveLocale } from "@/lib/locale";
import { notFound } from "next/navigation";
import { ProjectGalleryLightbox } from "@/components/app/projects/project-gallery-lightbox";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  SquareChartGantt,
  SquareCheckBig,
  BicepsFlexed,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import styles from "./project-detail.module.scss";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getActiveLocale();

  console.log("slug", slug, locale);

  const project = await sanity.fetch<Project>(projectBySlugQuery, {
    slug,
  });

  if (!project) {
    return {
      title: "Projet non trouvé",
    };
  }

  const title = locale === "en" ? project.title.en : project.title.fr;

  return {
    title: title || "Projet",
    description: title ? `Découvrez le projet ${title}` : "Détails du projet",
    openGraph: {
      title: title || "Projet",
      description: title ? `Découvrez le projet ${title}` : "Détails du projet",
      images: project.featuredImage
        ? [
            {
              url: project.featuredImage,
              width: project.featuredImageWidth || 1200,
              height: project.featuredImageHeight || 800,
            },
          ]
        : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const locale = await getActiveLocale();
  const t = await getTranslations();

  // Récupérer le projet par slug
  const project = await sanity.fetch<Project>(projectBySlugQuery, {
    slug,
  });

  // Si le projet n'existe pas, afficher la page 404
  if (!project) {
    notFound();
  }

  // Déterminer le titre et le contenu selon la locale
  const title = project.title[locale];
  const content = project.content[locale] as unknown as PortableTextBlock[];

  return (
    <main className="p-10 pb-12 md:p-12  md:pt-16 flex flex-col md:grid md:grid-cols-2 gap-12">
      <ProjectGalleryLightbox
        featuredImage={project.featuredImage}
        gallery={project.gallery}
        title={title}
        imageLabel={t("projects.details.image")}
      />
      <article>
        <Badge
          variant="default"
          className="mb-3"
          color={
            project.projectFilterType?.className
              ? `var(--${project.projectFilterType.className})`
              : undefined
          }
          textColor={
            project.projectFilterType?.className === "design"
              ? "black"
              : "white"
          }
        >
          {project.projectFilterType.title[locale]}
        </Badge>
        {/* En-tête du projet */}
        <h1 className="text-4xl font-black mb-4">{title}</h1>
        {/* Contenu principal */}
        {content && (
          <div
            className={cn(
              "prose prose-lg dark:prose-invert max-w-none",
              styles.textContent,
            )}
          >
            <PortableText value={content} />
          </div>
        )}
        <hr className={cn("mb-10 mt-16", styles.separator)} />
        {/* Métadonnées */}
        <div>
          {project.year && (
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" color="var(--primary)" />
              <strong>{t("projects.details.year")} :</strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {project.year}
              </span>
            </p>
          )}
          {project.type && (
            <p className="flex items-center gap-2">
              <SquareChartGantt className="w-4 h-4" color="var(--primary)" />
              <strong>{t("projects.details.type")} :</strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {locale === "en"
                  ? project.type.title.en
                  : project.type.title.fr}
              </span>
            </p>
          )}
          {project.status && (
            <p className="flex items-center gap-2">
              <SquareCheckBig className="w-4 h-4" color="var(--primary)" />
              <strong>{t("projects.details.status")} :</strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {locale === "en"
                  ? project.status.title.en
                  : project.status.title.fr}
              </span>
            </p>
          )}
          {project.client && (
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4" color="var(--primary)" />
              <strong>{t("projects.details.client")} :</strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {project.client.title
                  ? locale === "en"
                    ? project.client.title.en || project.client.title.fr
                    : project.client.title.fr || project.client.title.en
                  : project.client.name || ""}
              </span>
            </span>
          )}
        </div>

        {/* Lien vers le site web */}
        {project.website && (
          <div className="mt-4 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" color="var(--primary)" />
            <strong>{t("projects.details.visitWebsite")} :</strong>{" "}
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-gray-600 dark:text-gray-400 hover:underline"
            >
              {project.website}
            </a>
          </div>
        )}

        {/* Outils */}
        {project.tools && project.tools.length > 0 && (
          <div className="mt-3 flex items-start gap-4 flex-col lg:flex-row">
            <strong className="flex items-center gap-2 whitespace-nowrap">
              <BicepsFlexed className="w-4 h-4" color="var(--primary)" />
              {t("projects.details.tools")} :
            </strong>
            <div className="flex flex-wrap gap-2 mt-1 relative bottom-1.5">
              {project.tools.map((tool) => (
                <span
                  key={tool._id}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                >
                  {locale === "en" ? tool.title.en : tool.title.fr}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
