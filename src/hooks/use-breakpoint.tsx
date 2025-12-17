import { useEffect, useState } from "react";

// Breakpoints selon Tailwind et _variables.scss
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Breakpoints iPad selon _variables.scss
const ipadPortraitMin = 768;
const ipadPortraitMax = 1024;

type Breakpoint = keyof typeof breakpoints | "";

/**
 * Hook pour détecter le breakpoint actuel selon la convention Tailwind
 * @returns Le nom du breakpoint actuel ("sm", "md", "lg", "xl", "2xl" ou "")
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("");

  useEffect(() => {
    // Fonction pour déterminer le breakpoint actuel selon les ranges définis dans _mixins.scss
    const getCurrentBreakpoint = (): Breakpoint => {
      if (typeof window === "undefined") return "";

      const width = window.innerWidth;

      // Ranges selon _mixins.scss :
      // sm: 0px à 767px (max-width: md - 1px) - tout ce qui est en dessous de md
      // md: 768px à 1023px (min-width: md AND max-width: lg - 1px)
      // lg: 1024px à 1279px (min-width: lg AND max-width: xl - 1px)
      // xl: 1280px à 1535px (min-width: xl AND max-width: 2xl - 1px)
      // 2xl: 1536px et plus (min-width: 2xl)

      // Vérifier du plus grand au plus petit
      if (width >= breakpoints["2xl"]) return "2xl";
      if (width >= breakpoints.xl && width < breakpoints["2xl"]) return "xl";
      if (width >= breakpoints.lg && width < breakpoints.xl) return "lg";
      if (width >= breakpoints.md && width < breakpoints.lg) return "md";
      // sm: tout ce qui est en dessous de md
      if (width < breakpoints.md) return "sm";

      return "";
    };

    // Définir le breakpoint initial
    setBreakpoint(getCurrentBreakpoint());

    // Gérer le redimensionnement
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook pour détecter si l'appareil est un iPad en portrait
 * Couvre toutes les résolutions iPad en portrait :
 * - iPad standard : 768px x 1024px
 * - iPad Air : 820px x 1180px
 * - iPad Pro 11" : 834px x 1194px
 * @returns true si l'appareil est un iPad en portrait, false sinon
 */
export function useIsIpadPortrait(): boolean {
  const [isIpadPortrait, setIsIpadPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkIpadPortrait = (): boolean => {
      if (typeof window === "undefined") return false;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Vérifier la largeur (768px à 1023px) et l'orientation portrait
      const isInRange = width >= ipadPortraitMin && width < ipadPortraitMax;
      const isPortrait = height > width;

      return isInRange && isPortrait;
    };

    // Définir l'état initial
    setIsIpadPortrait(checkIpadPortrait());

    // Gérer le redimensionnement et la rotation
    const handleResize = () => {
      setIsIpadPortrait(checkIpadPortrait());
    };

    const handleOrientationChange = () => {
      // Petit délai pour laisser le navigateur mettre à jour les dimensions
      setTimeout(() => {
        setIsIpadPortrait(checkIpadPortrait());
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return isIpadPortrait;
}
