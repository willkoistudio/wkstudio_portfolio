/** @format */

import { useCallback, useEffect, useState } from "react";

interface UseScrollToTopOptions {
  /**
   * Ratio of the viewport height that needs to be scrolled before showing the button.
   * Example: 0.2 => show after 20% of the viewport height.
   */
  viewportThreshold?: number;
  /**
   * Scroll behavior used when returning to the top.
   */
  behavior?: ScrollBehavior;
}

export function useScrollToTop({
  viewportThreshold = 0.2,
  behavior = "smooth",
}: UseScrollToTopOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const threshold = window.innerHeight * viewportThreshold;
      setIsVisible(window.scrollY >= threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [viewportThreshold]);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, behavior });
  }, [behavior]);

  return { isVisible, scrollToTop };
}
