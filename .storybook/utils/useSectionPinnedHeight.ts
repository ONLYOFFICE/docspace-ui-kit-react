import { useLayoutEffect, useState } from "react";

/**
 * Height of what `Section` pins at the top of its scroller -- the header, the
 * submenu and, on desktop, the filter -- seen from an element inside the
 * section, kept current as it changes. A `DataTable` in the section body takes
 * it as `--data-table-header-top`, so its sticky header stops below that strip
 * rather than under it. 0 outside a section, or on a phone, where nothing is
 * pinned.
 */
export const useSectionPinnedHeight = (node: HTMLElement | null) => {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const pinned = node
      ?.closest("#section")
      ?.querySelector<HTMLElement>(".section-sticky-container");

    if (!pinned) {
      setHeight(0);
      return;
    }

    const measure = () => setHeight(pinned.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pinned);
    return () => observer.disconnect();
  }, [node]);

  return height;
};
