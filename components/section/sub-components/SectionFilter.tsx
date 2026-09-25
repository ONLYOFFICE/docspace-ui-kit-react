/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
