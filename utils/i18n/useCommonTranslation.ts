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

import { useState, useEffect, useCallback } from "react";

import { getCommonTranslation } from "./index";
import type { WindowI18n } from "./index";

const getI18nInstance = (): WindowI18n["instance"] | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { i18n?: WindowI18n }).i18n?.instance;
};

/**
 * A React hook that provides a reactive version of `getCommonTranslation`.
 * Listens to the app's i18n instance `languageChanged` event and forces a re-render,
 * ensuring that translated strings update when the language changes.
 *
 * Requires `window.i18n.instance` to be set by the host application.
 */
export const useCommonTranslation = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const instance = getI18nInstance();
    if (!instance) return;

    const handler = () => setTick((n) => n + 1);
    instance.on("languageChanged", handler);
    return () => {
      instance.off("languageChanged", handler);
    };
  }, []);

  const t = useCallback(
    (key: string, interpolation?: Record<string, string | number>) =>
      getCommonTranslation(key, interpolation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  return t;
};
