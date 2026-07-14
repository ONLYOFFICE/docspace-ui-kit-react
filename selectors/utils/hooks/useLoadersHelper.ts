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

import { MIN_LOADER_TIMER, SHOW_LOADER_TIMER } from "../constants";

export type SelectorSectionType = "breadcrumbs" | "body";

interface SectionLoaderState {
  timer: NodeJS.Timeout | null;
  startTime: Date | null;
}

const useLoadersHelper = ({ withInit }: { withInit?: boolean }) => {
  const [isNextPageLoading, setIsNextPageLoading] =
    React.useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoadState] = React.useState(!withInit);

  const [showBreadCrumbsLoader, setShowBreadCrumbsLoader] =
    React.useState<boolean>(!withInit);
  const [showBodyLoader, setShowBodyLoader] =
    React.useState<boolean>(!withInit);

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

  const isFirstLoadRef = React.useRef(!withInit);

  React.useEffect(() => {
    isFirstLoadRef.current = isFirstLoad;
  }, [isFirstLoad]);

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

  const setIsLoading = React.useCallback(
    (section: SelectorSectionType, isLoading: boolean) => {
      // On first load, don't hide sections individually — wait for setIsFirstLoad
      if (!isLoading && isFirstLoadRef.current) return;

      const state = loaderStates.current[section];

      if (isLoading) {
        if (state.timer) {
          clearTimeout(state.timer);
          state.timer = null;
        }

        if (isFirstLoadRef.current) {
          state.startTime = new Date();
          setVisibility(section, true);
          return;
        }

        state.timer = setTimeout(() => {
          state.startTime = new Date();
          setVisibility(section, true);
        }, SHOW_LOADER_TIMER);
      } else {
        if (state.timer && !state.startTime) {
          clearTimeout(state.timer);
          state.timer = null;
          state.startTime = null;
          setVisibility(section, false);
          return;
        }

        if (state.startTime) {
          const ms = Math.abs(state.startTime.getTime() - new Date().getTime());

          if (state.timer) {
            clearTimeout(state.timer);
            state.timer = null;
          }

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
        } else if (state.timer) {
          clearTimeout(state.timer);
          state.timer = null;
        }
      }
    },
    [setVisibility],
  );

  const setIsFirstLoad = React.useCallback(
    (value: boolean) => {
      setIsFirstLoadState(value);
      if (!value) {
        // Update ref synchronously so setIsLoading won't ignore these calls
        isFirstLoadRef.current = false;
        setIsLoading("breadcrumbs", false);
        setIsLoading("body", false);
      }
    },
    [setIsLoading],
  );

  const showSearchLoader =
    isFirstLoad && (showBreadCrumbsLoader || showBodyLoader);

  return {
    setIsLoading,

    isNextPageLoading,
    setIsNextPageLoading,

    isFirstLoad,
    setIsFirstLoad,

    showBreadCrumbsLoader,
    showSearchLoader,
    showBodyLoader,
  };
};

export default useLoadersHelper;

