/** @format */

"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu/navigation-menu";
import Image from "next/image";
import styles from "./header.module.scss";
import { cn } from "@/lib/utils";
import { useLocaleContext } from "@/contexts/locale-context";
import { Globe } from "lucide-react";

const headerMenuItems = [
  {
    label: "nav.home",
    href: "/",
  },
  {
    label: "nav.projects",
    href: "/projects",
  },
  {
    label: "nav.services",
    href: "/services",
  },
  {
    label: "nav.about",
    href: "/about",
  },

  {
    label: "nav.downloadResume",
    href: "https://drive.google.com/file/d/1R8IA6b233GFVSjGzwx3HHb2v-QmWChZq/view",
    isExternal: true,
  },
];

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setLocale } = useLocaleContext();

  const handleLangChange = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    setLocale(newLocale);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <NavigationMenu isMobile={isMobile}>
      <Image
        src="/images/logo-horizontal.svg"
        alt="WILLIAM KOI STUDIO"
        width={282}
        height={57.42}
        id="wkoistudio-logo"
      />
      <NavigationMenuList className="flex-wrap">
        <span
          id="lang-selector"
          className="font-bold cursor-pointer pr-3 flex gap-1 text-primary hover:text-primary-foreground transition-colors"
          onClick={handleLangChange}
        >
          <Globe size={16} className="relative top-1 " />
          {locale === "fr" ? "EN" : "FR"}
        </span>
        {headerMenuItems.map((item, index) => {
          const active = !item.isExternal && isActive(item.href);
          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  item.isExternal && styles.cvButton,
                  active && "bg-accent",
                )}
              >
                <Link
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className={cn(styles.navLink, active && styles.active)}
                >
                  {t(item.label)}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
