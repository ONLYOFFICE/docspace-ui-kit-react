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
