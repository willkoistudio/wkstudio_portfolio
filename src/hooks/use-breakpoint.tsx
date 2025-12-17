import { useEffect, useState } from "react";

// Breakpoints selon Tailwind et _variables.scss
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

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
