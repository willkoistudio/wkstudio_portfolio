/** @format */

"use client";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
// import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import styles from "./footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { socialMediaLinks } from "@/utils/social";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  // const isMobile = useIsMobile();

  // TODO: changer la couleur du texte des liens,
  // TODO: mettre les phrases en gris,

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
              {t("footer.title")}
            </p>
            <p className="text-sm !mb-6">{t("footer.description")}</p>
            <hr className="w-80 border-1 mb-6" />
            <ul className="flex flex-wrap gap-8 font-medium !ml-0">
              <li>
                <Link href={locale === "fr" ? "/" : `/${locale}`}>{t("nav.home")}</Link>
              </li>
              <li>
                <Link
                  href={locale === "fr" ? "/projects" : `/${locale}/projects`}
                >
                  {t("nav.projects")}
                </Link>
              </li>
              <li>
                <Link
                  href={locale === "fr" ? "/services" : `/${locale}/services`}
                >
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href={locale === "fr" ? "/about" : `/${locale}/about`}>
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
            <div className="flex flex-wrap gap-5 mt-3 justify-center md:justify-start">
              {socialMediaLinks.map((link) => (
                <Link key={link.name} href={link.url} target="_blank">
                  {link.icon ? (
                    <FontAwesomeIcon
                      icon={link.icon}
                      size="xl"
                      color="var(--muted-foreground)"
                    />
                  ) : (
                    <span
                      className={styles["social-icon-wrapper"]}
                      style={
                        {
                          "--icon-url": `url(${link.customIcon || ""})`,
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={link.customIcon || ""}
                        alt={link.name}
                        className={styles["social-icon-image"]}
                      />
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
