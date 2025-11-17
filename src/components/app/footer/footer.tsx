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

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <footer>
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/logo-horizontal.svg"
              alt="WILLIAM KOI STUDIO"
              width={282}
              height={57.42}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
