"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./about.module.scss";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { sanity } from "@/lib/sanity.client";
import { highlightedExperiencesQuery } from "@/lib/sanity.queries";
import { HighlightedExperience } from "@/models/highlightedExperience";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

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
      {/* Info section */}
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
      {/* Highlighted experience section */}
      <section className={cn(styles["about-highlited-experience"], "py-18")}>
        <div className="container">
          <h2 className="font-bold text-3xl mb-18 text-center">
            {t("about.highlitedExperience")}
          </h2>
          <div className="mt-10 flex flex-col gap-18">
            {experiences.map((experience, index) => (
              <HighlightedExperienceRow
                key={experience._id}
                experience={experience}
                sinceLabel={t("about.since")}
                toLabel={formatToLabel(experience.to)}
                positionLabel={getTranslatedJobPosition(experience)}
                isEven={(index + 1) % 2 === 0}
              />
            ))}
          </div>
        </div>
        <p className=" text-center text-white text-xl mt-18 font-medium">
          {t("about.seeMore")}
        </p>
        <Button
          className="!text-white rounded-3xl mt-6 block mx-auto text-lg"
          size="lg"
          onClick={() =>
            window.open(
              "https://drive.google.com/file/d/1R8IA6b233GFVSjGzwx3HHb2v-QmWChZq/view?usp=sharing",
              "_blank",
            )
          }
        >
          {t("about.downloadResume")}
        </Button>
      </section>
      {/* Form section */}
      <section className="bg-muted p-18 grid grid-cols-2">
        <div>{/* Form */}</div>
        <div>
          <h2 className="font-bold text-3xl mb-8">{t("about.footer.title")}</h2>
          <p className="text-lg">{t("about.footer.description")}</p>
          <hr
            className={cn(styles["about-highlited-experience-divider"], "mt-8")}
          />
          <p className="mt-8">📧 koi.william91@gmail.com</p>
        </div>
      </section>
    </main>
  );
}

type HighlightedExperienceRowProps = {
  experience: HighlightedExperience;
  sinceLabel: string;
  toLabel: string;
  positionLabel: string;
  isEven: boolean;
};

function HighlightedExperienceRow({
  experience,
  sinceLabel,
  toLabel,
  positionLabel,
  isEven,
}: HighlightedExperienceRowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const directionClass = isEven
    ? styles["about-highlited-experience-itemSlideLeft"]
    : styles["about-highlited-experience-itemSlideRight"];

  const visibilityClass = isVisible
    ? styles["about-highlited-experience-itemVisible"]
    : undefined;

  return (
    <div ref={rowRef}>
      <div
        className={cn(
          styles["about-highlited-experience-item"],
          directionClass,
          visibilityClass,
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
              <span>{sinceLabel}</span>{" "}
              <span className="font-bold">{experience.from}</span>
              <ChevronsRight
                className={cn("w-6 h-6 inline-block mx-3 relative bottom-0.5")}
                color="grey"
              />
              <span className="font-bold">{toLabel}</span>
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
            {positionLabel}
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
  );
}
