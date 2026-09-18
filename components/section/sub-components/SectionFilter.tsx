import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { SectionFilterProps } from "../Section.types";
import styles from "../Section.module.scss";
import { isDesktop, isMobile } from "../../../utils/device";

// These thresholds mirror the ones in the client's NavMenu, which pins the
// mobile nav bar off the same scroller and publishes --nav-offset. The filter's
// sticky top is calc(53px + var(--nav-offset)), so the two must reach the same
// verdict for the same gesture: whenever this component pins while NavMenu does
// not, the filter reserves 48px for a bar that is not on screen and comes to
// rest that far below the header. Keep both sets of values in sync.
const SCROLL_THRESHOLD = 5;
const NEAR_BOTTOM_THRESHOLD = 100;
const AT_TOP_THRESHOLD = 20;

const SectionFilter = React.memo(
  ({ className, children, withTabs }: SectionFilterProps) => {
    const scrollTopRef = useRef(0);
    const [isFixed, setIsFixed] = useState(false);

    const onScroll = useCallback((e: Event) => {
      const eventTarget = e.target as HTMLElement;
      const { scrollHeight, clientHeight } = eventTarget;

      // Clamp to the real scrollable range: iOS rubber-banding reports
      // scrollTop past both ends, and those values read as a direction change
      // once the bounce settles back.
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      const currentScrollTop = Math.min(
        Math.max(0, eventTarget.scrollTop),
        maxScrollTop,
      );

      const scrollShift = scrollTopRef.current - currentScrollTop;

      // Ignore sub-threshold jitter without moving the reference point, so that
      // a stream of tiny momentum deltas accumulates into one real gesture
      // instead of toggling the filter on noise.
      if (Math.abs(scrollShift) < SCROLL_THRESHOLD) return;

      scrollTopRef.current = currentScrollTop;

      // Scrolling up off the very bottom must not pin: the nav bar stays hidden
      // there, so --nav-offset is absent and a pinned filter would jump.
      const isNearBottom =
        scrollHeight - (currentScrollTop + clientHeight) <
        NEAR_BOTTOM_THRESHOLD;

      const isAtTop = currentScrollTop < AT_TOP_THRESHOLD;

      // An upward scroll wins over isAtTop: while the bar is pinned it occupies
      // the first 48px of the scroller, so a gesture ending near the top still
      // reports a small scrollTop, and checking isAtTop first would unpin
      // mid-gesture.
      if (scrollShift > 0 && !isNearBottom) {
        setIsFixed(true);
      } else if (isAtTop || scrollShift <= 0) {
        setIsFixed(false);
      }
    }, []);

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
