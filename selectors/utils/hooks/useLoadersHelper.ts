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

const useLoadersHelper = ({ withInit }: { withInit?: boolean }) => {
  const [isBreadCrumbsLoading, setIsBreadCrumbsLoading] =
    React.useState<boolean>(!withInit);
  const [isNextPageLoading, setIsNextPageLoading] =
    React.useState<boolean>(false);

  const [showBreadCrumbsLoader, setShowBreadCrumbsLoader] =
    React.useState<boolean>(!withInit);
  const [showLoader, setShowLoader] = React.useState<boolean>(!withInit);

  const [isFirstLoad, setIsFirstLoad] = React.useState(!withInit);

  const startLoader = React.useRef<Date | null>(withInit ? null : new Date());
  const loaderTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const breadCrumbsLoaderTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const breadCrumbsStartLoader = React.useRef<Date | null>(new Date());

  const isMount = React.useRef<boolean>(true);

  React.useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);

  const calculateLoader = React.useCallback(() => {
    if (isFirstLoad) {
      loaderTimeout.current = setTimeout(() => {
        startLoader.current = new Date();
        if (isMount.current) setShowLoader(true);
      }, SHOW_LOADER_TIMER);
    } else if (startLoader.current) {
      const currentDate = new Date();

      const ms = Math.abs(
        startLoader.current.getTime() - currentDate.getTime(),
      );

      if (loaderTimeout.current) {
        window.clearTimeout(loaderTimeout.current);
        loaderTimeout.current = null;
      }

      if (ms >= MIN_LOADER_TIMER) {
        startLoader.current = null;
        return setShowLoader(false);
      }

      setTimeout(() => {
        if (isMount.current) {
          startLoader.current = null;
          setShowLoader(false);
        }
      }, MIN_LOADER_TIMER - ms);
    } else if (loaderTimeout.current) {
      clearTimeout(loaderTimeout.current);
      loaderTimeout.current = null;
    }
  }, [isFirstLoad]);

  const calculateBreadCrumbsLoader = React.useCallback(() => {
    if (isBreadCrumbsLoading) {
      if (breadCrumbsLoaderTimeout.current) {
        return;
      }
      breadCrumbsLoaderTimeout.current = setTimeout(() => {
        breadCrumbsStartLoader.current = new Date();

        if (isMount.current) setShowBreadCrumbsLoader(true);
      }, SHOW_LOADER_TIMER);
    } else {
      if (breadCrumbsLoaderTimeout.current && !breadCrumbsStartLoader.current) {
        clearTimeout(breadCrumbsLoaderTimeout.current);
        breadCrumbsLoaderTimeout.current = null;
        breadCrumbsStartLoader.current = null;
        return setShowBreadCrumbsLoader(false);
      }

      if (breadCrumbsStartLoader.current) {
        const currentDate = new Date();

        const ms = Math.abs(
          breadCrumbsStartLoader.current.getTime() - currentDate.getTime(),
        );

        if (ms >= MIN_LOADER_TIMER) {
          breadCrumbsStartLoader.current = null;
          return setShowBreadCrumbsLoader(false);
        }

        setTimeout(() => {
          if (isMount.current) {
            breadCrumbsStartLoader.current = null;
            setShowBreadCrumbsLoader(false);
          }
        }, MIN_LOADER_TIMER - ms);
      }
    }
  }, [isBreadCrumbsLoading]);

  React.useEffect(() => {
    calculateLoader();
  }, [calculateLoader]);

  React.useEffect(() => {
    calculateBreadCrumbsLoader();
  }, [calculateBreadCrumbsLoader]);

  return {
    isBreadCrumbsLoading,
    setIsBreadCrumbsLoading,
    isNextPageLoading,
    setIsNextPageLoading,

    isFirstLoad,
    setIsFirstLoad,

    showBreadCrumbsLoader,
    showLoader,
  };
};

export default useLoadersHelper;
