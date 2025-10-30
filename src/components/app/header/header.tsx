/** @format */

"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";

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
  const isMobile = useIsMobile();
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
        {headerMenuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
              >
                {t(item.label)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
