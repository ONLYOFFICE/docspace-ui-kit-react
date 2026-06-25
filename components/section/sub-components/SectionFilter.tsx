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
