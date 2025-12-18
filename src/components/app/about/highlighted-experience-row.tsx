import { HighlightedExperience } from "@/models/highlightedExperience";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./highlighted-experience-row.module.scss";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";

type HighlightedExperienceRowProps = {
  experience: HighlightedExperience;
  sinceLabel: string;
  toLabel: string;
  positionLabel: string;
  isEven: boolean;
  index: number;
};

export default function HighlightedExperienceRow({
  experience,
  sinceLabel,
  toLabel,
  positionLabel,
  isEven,
  index,
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
          "flex flex-col md:grid md:grid-cols-2 gap-6 justify-center pb-6 md:pb-17",
        )}
      >
        <div className="flex gap-6 justify-start md:justify-end">
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
            <h4 className="text-xl md:text-2xl font-semibold mt-0">
              {experience.company}
            </h4>
            <hr
              className={cn(
                styles["about-highlited-experience-divider"],
                "my-4",
              )}
            />
            <p className="mt-4 text-base md:text-lg font-medium uppercase">
              {index === 0 && <span>{sinceLabel}</span>}{" "}
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
              "text-xl md:text-2xl",
            )}
          >
            {positionLabel}
          </p>
          {experience.clients?.length ? (
            <div>
              <p className="font-medium !mb-0">Clients :</p>
              <p className="text-muted-foreground font-medium">
                {experience.clients.join(" • ")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
