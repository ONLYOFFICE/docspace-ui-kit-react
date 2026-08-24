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

import React from "react";

import { MIN_LOADER_TIMER } from "../constants";
import useContentLoading from "./useContentLoading";

export type SelectorSectionType = "breadcrumbs" | "body";

interface SectionLoaderState {
  timer: NodeJS.Timeout | null;
  startTime: Date | null;
}

/**
 * Owns the loading state of a selector. Two loading modes exist:
 *
 * - Full load (`startFullLoad`/`finishFullLoad`): the section skeleton
 *   loaders own the screen. They are shown by the initial mount state and
 *   hidden together on `finishFullLoad`; on repeated full loads (folder
 *   navigation) the previous content stays on screen dimmed instead.
 * - Content refresh (`startContentLoading`): a soft reload (search, tab
 *   change) that only dims the current content.
 *
 * `finishFullLoad` ends both modes.
 */
const useLoadersHelper = ({ withInit }: { withInit?: boolean }) => {
  const [isNextPageLoading, setIsNextPageLoading] =
    React.useState<boolean>(false);
  const [isFullLoadActive, setIsFullLoadActiveState] = React.useState(
    !withInit,
  );

  const [showBreadCrumbsLoader, setShowBreadCrumbsLoader] =
    React.useState<boolean>(!withInit);
  const [showBodyLoader, setShowBodyLoader] =
    React.useState<boolean>(!withInit);

  const { isContentLoading, startContentLoading, finishContentLoading } =
    useContentLoading({ initiallyLoaded: withInit });

  const isMount = React.useRef<boolean>(true);

  const loaderStates = React.useRef<
    Record<SelectorSectionType, SectionLoaderState>
  >({
    breadcrumbs: {
      timer: null,
      startTime: withInit ? null : new Date(),
    },
    body: {
      timer: null,
      startTime: withInit ? null : new Date(),
    },
  });

  const isFullLoadActiveRef = React.useRef(!withInit);

  React.useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;

      const { breadcrumbs, body } = loaderStates.current;
      if (breadcrumbs.timer) clearTimeout(breadcrumbs.timer);
      if (body.timer) clearTimeout(body.timer);
    };
  }, []);

  const setVisibility = React.useCallback(
    (section: SelectorSectionType, visible: boolean) => {
      if (!isMount.current) return;

      if (section === "breadcrumbs") {
        setShowBreadCrumbsLoader(visible);
      } else {
        setShowBodyLoader(visible);
      }
    },
    [],
  );

  // Hides a section loader, keeping it visible for at least MIN_LOADER_TIMER
  // since it appeared so it doesn't flash
  const hideSection = React.useCallback(
    (section: SelectorSectionType) => {
      const state = loaderStates.current[section];

      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }

      if (!state.startTime) {
        setVisibility(section, false);
        return;
      }

      const ms = Math.abs(state.startTime.getTime() - new Date().getTime());

      if (ms >= MIN_LOADER_TIMER) {
        state.startTime = null;
        setVisibility(section, false);
        return;
      }

      state.timer = setTimeout(() => {
        if (isMount.current) {
          state.startTime = null;
          state.timer = null;
          setVisibility(section, false);
        }
      }, MIN_LOADER_TIMER - ms);
    },
    [setVisibility],
  );

  const hideSectionLoader = React.useCallback(
    (section: SelectorSectionType) => {
      // During a full load sections hide together — wait for finishFullLoad
      if (isFullLoadActiveRef.current) return;

      hideSection(section);
    },
    [hideSection],
  );

  const startFullLoad = React.useCallback(
    (options?: { dim?: boolean }) => {
      // Repeated full loads keep the previous content on screen dimmed
      if (options?.dim !== false) startContentLoading();

      isFullLoadActiveRef.current = true;
      setIsFullLoadActiveState(true);
    },
    [startContentLoading],
  );

  const finishFullLoad = React.useCallback(() => {
    isFullLoadActiveRef.current = false;
    setIsFullLoadActiveState(false);

    hideSection("breadcrumbs");
    hideSection("body");

    finishContentLoading();
  }, [hideSection, finishContentLoading]);

  const showSearchLoader =
    isFullLoadActive && (showBreadCrumbsLoader || showBodyLoader);

  return {
    isNextPageLoading,
    setIsNextPageLoading,

    isFullLoadActive,
    startFullLoad,
    finishFullLoad,

    isContentLoading,
    startContentLoading,
    finishContentLoading,

    hideSectionLoader,

    showBreadCrumbsLoader,
    showSearchLoader,
    showBodyLoader,
  };
};

export default useLoadersHelper;
