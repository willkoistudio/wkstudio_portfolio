/** @format */

"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
// import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import styles from "./footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { socialMediaLinks } from "@/utils/social";

export function Footer() {
  const t = useTranslations();
  // const isMobile = useIsMobile();

  return (
    <footer id={styles["wkoistudio-footer"]} className="py-12">
      <div className="container">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center text-white">
            <Image
              src="/images/wkoistudio_logo.svg"
              alt="WILLIAM KOI STUDIO"
              width={200}
              height={200}
            />
            <p className="mt-6 text-sm text-center !mb-0">
              © 2025-2026 - WKOISTUDIO. All rights reserved.
            </p>
            <p className="text-sm !mb-6">
              Développement web, UX/UI design, Webdesign, Graphisme.
            </p>
            <hr className="w-80 border-1 mb-6" />
            <ul className="flex flex-wrap gap-8 font-medium !ml-0">
              <li>
                <Link href="/">{t("nav.home")}</Link>
              </li>
              <li>
                <Link href="/projects">{t("nav.projects")}</Link>
              </li>
              <li>
                <Link href="/services">{t("nav.services")}</Link>
              </li>
              <li>
                <Link href="/about">{t("nav.about")}</Link>
              </li>
            </ul>
            <div className="flex flex-wrap gap-5 mt-3">
              {socialMediaLinks.map((link) => (
                <Link key={link.name} href={link.url} target="_blank">
                  {link.icon ? (
                    <FontAwesomeIcon icon={link.icon} size="xl" color="white" />
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6">
                      <img src={link.customIcon || ""} alt={link.name} />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
