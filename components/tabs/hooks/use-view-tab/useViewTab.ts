import { useEffect, useState, useRef, RefObject } from "react";

import { ScrollbarType } from "../../../scrollbar";

export const useViewTab = (
  containerRef: RefObject<ScrollbarType | null>,
  tabRef: RefObject<HTMLDivElement | null>,
  index: number,
) => {
  const [isViewTab, setIsViewTab] = useState<boolean>(true);
  const observerRef = useRef<IntersectionObserver>(undefined);

  useEffect(() => {
    const container = containerRef.current?.scrollerElement;
    const trackedElement = tabRef.current?.children[index];
    if (!container || !trackedElement) return;

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      setIsViewTab(entry.isIntersecting);
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: container,
      rootMargin: "4px",
      threshold: 1,
    });

    observerRef.current.observe(trackedElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(trackedElement);
      }
    };
  }, [containerRef, index, tabRef]);

  return isViewTab;
};
