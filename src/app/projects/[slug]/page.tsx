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
  const title = locale === "en" ? project.title.en : project.title.fr;
  const content = locale === "en" ? project.content.en : project.content.fr;

  return (
    <main className="container py-12">
      <article className="max-w-4xl mx-auto">
        {/* Image principale */}
        {project.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.featuredImage}
              alt={title || ""}
              width={project.featuredImageWidth || 1200}
              height={project.featuredImageHeight || 800}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* En-tête du projet */}
        <header className="mb-8">
          <h1 className="text-4xl font-black mb-4">{title}</h1>

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
                {locale === "en"
                  ? project.type.title.en
                  : project.type.title.fr}
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
              <strong className="text-sm">
                {t("projects.details.tools")}:
              </strong>
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
        </header>

        {/* Contenu principal */}
        {content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={content} />
          </div>
        )}

        {/* Galerie d'images */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {t("projects.details.gallery")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((imageUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${title} - ${t("projects.details.image")} ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
