"use client";
/** @format */

import Link from "next/link";
import styles from "./app.module.scss";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { socialMediaLinks } from "@/utils/social";
import { useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export default function Home() {
  const router = useRouter();
  const t = useTranslations();
  const backgroundWrapperRef = useRef<HTMLDivElement | null>(null);
  const primaryLayerRef = useRef<HTMLDivElement | null>(null);
  const secondaryLayerRef = useRef<HTMLDivElement | null>(null);
  const breakpoint = useBreakpoint();
  const [avatarWidth, setAvatarWidth] = useState<number>(0);
  const [avatarHeight, setAvatarHeight] = useState<number>(0);

  useEffect(() => {
    const wrapper = backgroundWrapperRef.current;
    const primary = primaryLayerRef.current;
    const secondary = secondaryLayerRef.current;

    if (!wrapper || !primary || !secondary) {
      return;
    }

    let animationId = 0;
    let fadeId = 0;
    let lastTime = performance.now();
    const verticalSpeed = 10; // pixels par seconde
    const diagonalRatio = 0.1;
    let primaryY = 0;
    let secondaryY = wrapper.offsetHeight || window.innerHeight;

    const handleResize = () => {
      primaryY = 0;
      secondaryY = wrapper.offsetHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    fadeId = requestAnimationFrame(() => {
      wrapper.style.opacity = "1";
    });

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const height = wrapper.offsetHeight || window.innerHeight;

      primaryY -= verticalSpeed * delta;
      secondaryY -= verticalSpeed * delta;

      if (primaryY <= -height) {
        primaryY += height * 2;
      }

      if (secondaryY <= -height) {
        secondaryY += height * 2;
      }

      const horizontalOffset = Math.sin(time / 5000) * height * diagonalRatio;

      primary.style.transform = `translate3d(${horizontalOffset}px, ${primaryY}px, 0)`;
      secondary.style.transform = `translate3d(${horizontalOffset}px, ${secondaryY}px, 0)`;

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    handleResize();

    return () => {
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(fadeId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    switch (breakpoint) {
      case "sm":
      case "md":
        setAvatarWidth(250);
        setAvatarHeight(374);
        break;
      case "lg":
        setAvatarWidth(300);
        setAvatarHeight(448);
        break;
      case "xl":
        setAvatarWidth(408);
        setAvatarHeight(609);
        break;
      case "2xl":
        setAvatarWidth(408);
        setAvatarHeight(609);
        break;
      default:
        setAvatarWidth(408);
        setAvatarHeight(609);
        break;
    }
  }, [breakpoint]);

  return (
    <main className="grid grid-cols-2" id={styles["home-container"]}>
      {/* Left section */}
      <section
        id={styles["left-section"]}
        className={"flex flex-col justify-space-between h-full"}
      >
        <div className={styles["left-section-content"]}>
          <h1
            className={`${styles["home-title"]} text-center font-black mb-8 sm:hidden md:hidden lg:block`}
            dangerouslySetInnerHTML={{ __html: t.raw("home.title") }}
          />
          <p
            className={`${styles["home-description"]} text-center`}
            dangerouslySetInnerHTML={{ __html: t.raw("home.description") }}
          />

          <ArrowDown
            size={28}
            className="animate-bounce stroke-primary mx-auto 2xl:my-8 xl:my-6 md:my-8"
          />
          <ul className="list-disc flex flex-wrap gap-2 justify-center text-white">
            {t.raw("home.skills").map((skill: string, index: number) => (
              <li
                key={index}
                className={`${styles["skills-list-item"]} bg-primary font-semibold hover:bg-primary-foreground rounded-md px-2 py-1 transition-colors`}
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          className={`${styles["home-footer"]} grid grid-cols-2 lg:gap-2 xl:gap-8 mt-auto text-white`}
        >
          <div>
            <p
              className="font-medium"
              dangerouslySetInnerHTML={{ __html: t.raw("home.footer.title") }}
            />
            <p className="font-bold">{t("home.footer.description")}</p>
            <Button
              className="text-white rounded-2xl"
              size={breakpoint === "lg" ? "sm" : "default"}
              onClick={() => router.push("/projects")}
            >
              {t("home.footer.projects")}
            </Button>
            <span className="md:px-3 lg:px-2 xl:px-3 font-bold">
              {t("home.footer.or")}
            </span>
            <Button
              className="text-white rounded-2xl"
              size={breakpoint === "lg" ? "sm" : "default"}
              onClick={() => router.push("/services")}
            >
              <span className="">{t("home.footer.services")}</span>
            </Button>
          </div>
          <div>
            <p className="font-medium">{t("home.footer.socialMedia")}</p>
            <div className="flex flex-wrap gap-5">
              {socialMediaLinks.map((link) => (
                <Link key={link.name} href={link.url} target="_blank">
                  {link.icon ? (
                    <FontAwesomeIcon
                      icon={link.icon}
                      size={breakpoint === "lg" ? "xl" : "2xl"}
                      color="white"
                    />
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center ${breakpoint === "lg" ? "w-6 h-6" : "w-8 h-8"}`}
                    >
                      <img src={link.customIcon || ""} alt={link.name} />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Right section */}
      <section id={styles["right-section"]}>
        <h1
          className={`${styles["home-title"]} text-white font-black lg:hidden`}
          dangerouslySetInnerHTML={{ __html: t.raw("home.title") }}
        />
        <div
          id={styles["background-layers"]}
          ref={backgroundWrapperRef}
          aria-hidden="true"
        >
          <div className={styles["background-layer"]} ref={primaryLayerRef} />
          <div className={styles["background-layer"]} ref={secondaryLayerRef} />
        </div>
        <div className={styles["wkoistudio-avatar-wrapper"]}>
          <Image
            src="/images/william_koi_avatar.svg"
            alt="William Koï Avatar"
            width={avatarWidth}
            height={avatarHeight}
            className={styles["wkoistudio-avatar"]}
          />
        </div>
      </section>
    </main>
  );
}
