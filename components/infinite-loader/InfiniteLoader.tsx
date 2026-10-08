import { useState, useEffect } from "react";

import { MAX_INFINITE_LOADER_SHIFT, isMobile } from "../../utils/device";

import ListComponent from "./sub-components/list/List";
import GridComponent from "./sub-components/grid/Grid";

import { InfiniteLoaderProps } from "./InfiniteLoader.types";

const InfiniteLoaderComponent = (props: InfiniteLoaderProps) => {
  const { viewAs, isLoading } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const scroll = isMobile()
    ? document.querySelector("#customScrollBar .scroll-wrapper > .scroller")
    : document.querySelector("#sectionScroll .scroll-wrapper > .scroller");

  const onScroll = (e: Event) => {
    const eventTarget = e.target as HTMLElement;
    const currentScrollTop = eventTarget.scrollTop;

    setScrollTop(currentScrollTop ?? 0);

    const scrollShift = scrollTop - currentScrollTop;

    if (
      scrollShift > MAX_INFINITE_LOADER_SHIFT ||
      scrollShift < -MAX_INFINITE_LOADER_SHIFT
    ) {
      setShowSkeleton(true);
      setTimeout(() => {
        setShowSkeleton(false);
      }, 200);
    }
  };

  useEffect(() => {
    if (scroll) scroll.addEventListener("scroll", onScroll);

    return () => {
      if (scroll) scroll.removeEventListener("scroll", onScroll);
    };
  });

  if (isLoading) return null;

  return viewAs === "tile" ? (
    <GridComponent
      scroll={scroll ?? window}
      showSkeleton={showSkeleton}
      {...props}
    />
  ) : (
    <ListComponent
      scroll={scroll ?? window}
      showSkeleton={showSkeleton}
      {...props}
    />
  );
};

export { InfiniteLoaderComponent };
