/** @format */

import { sanity } from "@/lib/sanity.client";
import { projectBySlugQuery } from "@/lib/sanity.queries";
import { Project } from "@/models/projects";
import { getActiveLocale } from "@/lib/locale";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

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

  // UI : en mode lg et plus, photo et gallerie a gauche, contenu a droite avec un scroll que sur le contenu de droite.
  // en mode md et en dessous, photo et gallerie en haut, contenu en bas. (voir page detail de dribbble),
  // Chaque image principal devrait etre un gif ou une video.
  return (
    <main className="p-12 grid grid-cols-2 gap-12">
      <section className="flex gap-4">
        {" "}
        {/* Image principale */}
        {project.featuredImage && (
          <div>
            <img
              src={project.featuredImage}
              alt={title || ""}
              height="auto"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        {/* Galerie d'images */}
        {project.gallery && project.gallery.length > 0 && (
          <section>
            <div className="flex flex-col gap-4">
              {project.gallery.map((imageUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`${title} - ${t("projects.details.image")} ${index + 1}`}
                    width={400}
                    height={400}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
      <article>
        {/* En-tête du projet */}
        <h1 className="text-4xl font-black mb-4">{title}</h1>
        {/* Contenu principal */}
        {content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={content} />
          </div>
        )}
        {/* Métadonnées */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          {project.year && (
            <span>
              <strong>{t("projects.details.year")}:</strong> {project.year}
            </span>
          )}
          {project.type && (
            <span>
              <strong>{t("projects.details.type")}:</strong>{" "}
              {locale === "en" ? project.type.title.en : project.type.title.fr}
            </span>
          )}
          {project.status && (
            <span>
              <strong>{t("projects.details.status")}:</strong>{" "}
              {locale === "en"
                ? project.status.title.en
                : project.status.title.fr}
            </span>
          )}
          {project.client && (
            <span>
              <strong>{t("projects.details.client")}:</strong>{" "}
              {locale === "en"
                ? project.client.title.en
                : project.client.title.fr}
            </span>
          )}
        </div>

        {/* Outils */}
        {project.tools && project.tools.length > 0 && (
          <div className="mt-4">
            <strong className="text-sm">{t("projects.details.tools")}:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
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

        {/* Lien vers le site web */}
        {project.website && (
          <div className="mt-4">
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {t("projects.details.visitWebsite")} →
            </a>
          </div>
        )}
      </article>
    </main>
  );
}
