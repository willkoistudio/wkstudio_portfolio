/** @format */

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Vérifier au chargement initial
    checkIsMobile();

    // Écouter les changements de taille de fenêtre
    window.addEventListener("resize", checkIsMobile);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
