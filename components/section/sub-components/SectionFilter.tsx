import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import { SectionFilterProps } from "../Section.types";
import styles from "../Section.module.scss";
import { isDesktop, isMobile } from "../../../utils/device";

const SectionFilter = React.memo(
  ({ className, children, withTabs }: SectionFilterProps) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [isFixed, setIsFixed] = useState(false);

    const onScroll = useCallback(
      (e: Event) => {
        const eventTarget = e.target as HTMLElement;
        const currentScrollTop = eventTarget.scrollTop;

        setScrollTop(currentScrollTop ?? 0);

        const scrollShift = scrollTop - currentScrollTop;

        if (scrollShift > 0) {
          setIsFixed(true);
        } else if (scrollShift <= 0) {
          setIsFixed(false);
        }
      },
      [scrollTop],
    );

    useEffect(() => {
      const scroll = isMobile()
        ? document.querySelector("#customScrollBar .scroll-wrapper > .scroller")
        : document.querySelector("#sectionScroll .scroll-wrapper > .scroller");
      scroll?.addEventListener("scroll", onScroll);

      return () => {
        scroll?.removeEventListener("scroll", onScroll);
      };
    }, [onScroll]);

    return (
      <div
        className={classNames(styles.filter, "section-filter", className, {
          [styles.isFixed]: !isDesktop() ? isFixed : false,
          [styles.withTabs]: withTabs,
        })}
      >
        {children}
      </div>
    );
  },
);

SectionFilter.displayName = "SectionFilter";

export default SectionFilter;
