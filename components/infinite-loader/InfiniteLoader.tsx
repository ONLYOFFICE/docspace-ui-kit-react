import { useState, useEffect, useRef } from "react";

import { MAX_INFINITE_LOADER_SHIFT, isMobile } from "../../utils/device";

import ListComponent from "./sub-components/list/List";
import GridComponent from "./sub-components/grid/Grid";

import { InfiniteLoaderProps } from "./InfiniteLoader.types";

const DESKTOP_SCROLLER = "#sectionScroll .scroll-wrapper > .scroller";
const MOBILE_SCROLLER = "#customScrollBar .scroll-wrapper > .scroller";

const findPortalScroller = () =>
  document.querySelector(isMobile() ? MOBILE_SCROLLER : DESKTOP_SCROLLER);

const InfiniteLoaderComponent = (props: InfiniteLoaderProps) => {
  const { viewAs, isLoading, scrollElement } = props;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const lastScrollTop = useRef(0);
  const skeletonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTarget: Element | (Window & typeof globalThis) =
    scrollElement ?? findPortalScroller() ?? window;

  useEffect(() => {
    const readScrollTop = () =>
      (scrollTarget instanceof Element
        ? scrollTarget.scrollTop
        : scrollTarget.scrollY) ?? 0;

    lastScrollTop.current = readScrollTop();

    const onScroll = () => {
      const currentScrollTop = readScrollTop();
      const scrollShift = lastScrollTop.current - currentScrollTop;

      lastScrollTop.current = currentScrollTop;

      if (Math.abs(scrollShift) > MAX_INFINITE_LOADER_SHIFT) {
        setShowSkeleton(true);
        if (skeletonTimer.current) clearTimeout(skeletonTimer.current);
        skeletonTimer.current = setTimeout(() => {
          skeletonTimer.current = null;
          setShowSkeleton(false);
        }, 200);
      }
    };

    scrollTarget.addEventListener("scroll", onScroll);

    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
    };
  }, [scrollTarget]);

  useEffect(
    () => () => {
      if (skeletonTimer.current) clearTimeout(skeletonTimer.current);
    },
    [],
  );

  if (isLoading) return null;

  // The loader's own scroll element and skeleton flag win over anything in
  // props: `showSkeleton` is computed here, never taken from the caller.
  return viewAs === "tile" ? (
    <GridComponent
      {...props}
      scroll={scrollTarget}
      showSkeleton={showSkeleton}
    />
  ) : (
    <ListComponent
      {...props}
      scroll={scrollTarget}
      showSkeleton={showSkeleton}
    />
  );
};

export { InfiniteLoaderComponent };
