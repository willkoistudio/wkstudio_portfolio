"use client";
/** @format */

// import Link from "next/link";

import styles from "./app.module.scss";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const backgroundWrapperRef = useRef<HTMLDivElement | null>(null);
  const primaryLayerRef = useRef<HTMLDivElement | null>(null);
  const secondaryLayerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <main className="grid grid-cols-2" id={styles["home-container"]}>
      <section id={styles["left-section"]}></section>
      <section id={styles["right-section"]}>
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
            width={408}
            height={761}
            className={styles["wkoistudio-avatar"]}
          />
        </div>
      </section>
    </main>
  );
}
