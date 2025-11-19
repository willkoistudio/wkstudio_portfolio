/** @format */

import { useEffect, useState, RefObject } from "react";

/**
 * Hook pour détecter si un élément avec position sticky est actuellement "collé"
 * @param ref Référence à l'élément à observer
 * @returns true si l'élément est sticky (collé), false sinon
 */
export function useSticky(ref: RefObject<HTMLElement | null>) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let initialOffsetTop = element.offsetTop;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const computedStyle = getComputedStyle(element);
      const stickyTop = parseInt(computedStyle.top.replace("px", "")) || 0;

      // Si l'élément est sticky, sa position top sera égale à stickyTop
      // On vérifie que l'élément n'est plus à sa position initiale
      const isCurrentlySticky = rect.top <= stickyTop && rect.top >= 0;

      setIsSticky(isCurrentlySticky);
    };

    // Recalculer la position initiale au resize
    const handleResize = () => {
      initialOffsetTop = element.offsetTop;
      handleScroll();
    };

    // Vérifier au chargement
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return isSticky;
}
