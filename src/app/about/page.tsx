"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./about.module.scss";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { sanity } from "@/lib/sanity.client";
import { highlightedExperiencesQuery } from "@/lib/sanity.queries";
import { HighlightedExperience } from "@/models/highlightedExperience";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";

export default function About() {
  const t = useTranslations();
  const locale = useLocale();
  const [experiences, setExperiences] = useState<HighlightedExperience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await sanity.fetch<HighlightedExperience[]>(
          highlightedExperiencesQuery,
        );
        setExperiences(data);
      } catch (error) {
        console.error("Failed to load highlighted experiences:", error);
      }
    };

    fetchExperiences();
  }, []);

  const formatToLabel = (value?: string) => {
    if (!value) return "";
    return value === "present" ? t("about.present") : value;
  };

  const getTranslatedJobPosition = (experience: HighlightedExperience) => {
    return locale === "en"
      ? (experience.position?.en ?? experience.position?.fr ?? "")
      : (experience.position?.fr ?? experience.position?.en ?? "");
  };

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
      <section className={cn(styles["about-highlited-experience"], "py-14")}>
        <div className="container">
          <h2 className="font-bold text-3xl mb-18 text-center">
            {t("about.highlitedExperience")}
          </h2>
          <div className="mt-10 flex flex-col gap-18">
            {experiences.map((experience) => (
              <div key={experience._id}>
                <div
                  className={cn(
                    styles["about-highlited-experience-item"],
                    "grid grid-cols-2 gap-6 justify-center pb-17",
                  )}
                >
                  <div className="flex gap-6 justify-end">
                    {experience.logo && (
                      <Image
                        src={experience.logo}
                        alt={experience.company}
                        loading="lazy"
                        width={100}
                        height={100}
                        className="rounded-sm"
                      />
                    )}
                    <div>
                      <h4 className="text-2xl font-semibold mt-0">
                        {experience.company}
                      </h4>
                      <hr
                        className={cn(
                          styles["about-highlited-experience-divider"],
                          "my-4",
                        )}
                      />
                      <p className="mt-4 text-lg font-medium uppercase">
                        <span>{t("about.since")}</span>{" "}
                        <span className="font-bold">{experience.from}</span>
                        <ChevronsRight
                          className="w-6 h-6 inline-block mx-3 relative bottom-0.5"
                          color="grey"
                        />
                        <span className="font-bold">
                          {formatToLabel(experience.to)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className={cn(
                        styles["about-highlited-experience-job-position"],
                        "text-2xl",
                      )}
                    >
                      {getTranslatedJobPosition(experience)}
                    </p>
                    {experience.clients?.length ? (
                      <div>
                        <p className="font-medium !mb-0">Clients :</p>
                        <p className="text-muted-foreground">
                          {experience.clients.join(" • ")}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
