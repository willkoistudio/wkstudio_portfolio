/** @format */

"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBreakpoint } from "@/hooks/use-breakpoint";
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
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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
  const breakpoint = useBreakpoint();
  const { setLocale } = useLocaleContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1023px et moins = md et sm
  const isTabletOrMobile = breakpoint === "sm" || breakpoint === "md";
  const isMobileOnly = breakpoint === "sm";

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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Fermer le drawer quand on change de page
  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <NavigationMenu isMobile={isMobile}>
        <Image
          src="/images/logo-horizontal.svg"
          alt="WILLIAM KOI STUDIO"
          width={282}
          height={57.42}
          id="wkoistudio-logo"
        />
        {isTabletOrMobile ? (
          <button
            onClick={toggleDrawer}
            className={styles.hamburgerButton}
            aria-label="Menu"
          >
            {isDrawerOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} className="text-primary" />
            )}
          </button>
        ) : (
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
        )}
      </NavigationMenu>

      {/* Overlay */}
      {isTabletOrMobile && isDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {isTabletOrMobile && (
        <div
          className={cn(
            styles.drawer,
            isDrawerOpen && styles.drawerOpen,
            isMobileOnly && styles.drawerFullscreen,
          )}
        >
          <div className={styles.drawerHeader}>
            <button
              onClick={closeDrawer}
              className={cn(styles.closeButton, "mr0 ml-auto")}
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className={styles.drawerNav}>
            <div
              className={styles.drawerLangSelector}
              onClick={handleLangChange}
            >
              <Globe size={16} />
              {locale === "fr" ? "EN" : "FR"}
            </div>
            {headerMenuItems.map((item, index) => {
              const active = !item.isExternal && isActive(item.href);
              return (
                <Link
                  key={index}
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className={cn(
                    styles.drawerNavItem,
                    item.isExternal && styles.drawerCvButton,
                    active && styles.drawerNavItemActive,
                  )}
                  onClick={closeDrawer}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
