// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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

          setTimeout(() => {
            if (isMount.current) {
              state.startTime = null;
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

