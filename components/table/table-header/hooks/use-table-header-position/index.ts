import { useEffect, RefObject } from "react";
import { isSafari } from "react-device-detect";

export const useTableHeaderPosition = (
  headerRef: RefObject<HTMLDivElement | null>,
): void => {
  useEffect(() => {
    if (!isSafari) return undefined;

    const updateHeaderTop = () => {
      const header = headerRef?.current;
      if (!header) return;

      const filterSelectedRow = document.querySelector(
        ".filter-input_selected-row",
      );

      if (filterSelectedRow) {
        const rect = filterSelectedRow.getBoundingClientRect();
        header.style.top = `${Math.round(rect.bottom) + 2}px`;
      } else {
        header.style.top = "unset";
      }
    };

    updateHeaderTop();

    const observer = new MutationObserver(updateHeaderTop);
    const body = document.body;

    observer.observe(body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", updateHeaderTop);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderTop);
    };
  }, [headerRef]);
};
