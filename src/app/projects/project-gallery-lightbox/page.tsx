"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import styles from "./project-gallery-lightbox.module.scss";
import { cn } from "@/lib/utils";

type Props = {
  featuredImage?: string;
  gallery?: string[];
  title?: string | null;
  imageLabel: string; // ex: t("projects.details.image")
};

export function ProjectGalleryLightbox({
  featuredImage,
  gallery = [],
  title,
  imageLabel,
}: Props) {
  const slides = [featuredImage, ...gallery].filter(Boolean).map((src, i) => ({
    src: src as string,
    alt: `${title ?? "Image"} ${i === 0 ? "(hero)" : `${imageLabel} ${i}`}`,
  }));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!slides.length) return null;

  return (
    <>
      <section className="flex gap-4">
        <div>
          <img
            src={slides[0].src}
            alt={slides[0].alt}
            className="w-full h-auto rounded-lg cursor-pointer"
            onClick={() => {
              setIndex(0);
              setOpen(true);
            }}
          />
        </div>
        {slides.length > 1 && (
          <div className="flex flex-col gap-4 ">
            {slides.slice(1).map((s, i) => (
              <div
                key={s.src}
                className={cn(
                  styles.galleryItem,
                  "rounded-lg overflow-hidden cursor-pointer",
                )}
                onClick={() => {
                  setIndex(i + 1);
                  setOpen(true);
                }}
              >
                <img src={s.src} alt={s.alt} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails]}
      />
    </>
  );
}
