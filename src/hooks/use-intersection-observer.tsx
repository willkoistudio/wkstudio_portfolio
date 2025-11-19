/** @format */

import { useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook personnalisé pour observer l'intersection d'un élément avec le viewport
 * @param callback Fonction appelée quand l'élément entre dans la vue
 * @param options Options pour l'IntersectionObserver
 * @returns Ref à attacher à l'élément à observer
 */
export function useIntersectionObserver(
  callback: (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
    isIntersecting: boolean,
  ) => void,
  options: UseIntersectionObserverOptions = {},
): RefObject<HTMLElement> {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const elementRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si triggerOnce est true et que l'animation a déjà été déclenchée, ne pas créer d'observer
    if (triggerOnce && hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          callback([entry], observer, isIntersecting);

          if (isIntersecting && triggerOnce) {
            hasTriggeredRef.current = true;
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin, triggerOnce]);

  return elementRef as RefObject<HTMLElement>;
}
