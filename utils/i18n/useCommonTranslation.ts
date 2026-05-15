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

import { useSyncExternalStore, useCallback } from "react";

import { getCurrentCommonLanguage, getCommonTranslation } from "./index";
import type { WindowI18n } from "./index";

const getI18nInstance = (): WindowI18n["instance"] | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { i18n?: WindowI18n }).i18n?.instance;
};

const INSTANCE_READY_EVENT = "i18n:instance-ready";
const interceptedTargets = new WeakSet<object>();

/**
 * Restores an intercepted property back to a normal writable descriptor.
 */
const restoreProperty = (
  target: object,
  key: "i18n" | "instance",
  value: WindowI18n | WindowI18n["instance"],
): void => {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

const dispatchInstanceReady = (): void => {
  window.dispatchEvent(new Event(INSTANCE_READY_EVENT));
};

const ensureInstanceInterceptor = (i18n: WindowI18n): void => {
  if (interceptedTargets.has(i18n) || i18n.instance) return;

  interceptedTargets.add(i18n);
  let storedInstance: WindowI18n["instance"];

  Object.defineProperty(i18n, "instance", {
    get: () => storedInstance,
    set(value: WindowI18n["instance"]) {
      storedInstance = value;

      if (!value) return;

      restoreProperty(i18n, "instance", value);
      interceptedTargets.delete(i18n);
      dispatchInstanceReady();
    },
    configurable: true,
    enumerable: true,
  });
};

const ensureI18nSubscriptionSource = (): void => {
  if (typeof window === "undefined") return;

  const w = window as unknown as { i18n?: WindowI18n };

  if (w.i18n) {
    ensureInstanceInterceptor(w.i18n);
    return;
  }

  if (interceptedTargets.has(w as object)) return;

  interceptedTargets.add(w as object);
  let storedI18n: WindowI18n | undefined;

  Object.defineProperty(w, "i18n", {
    get: () => storedI18n,
    set(value: WindowI18n | undefined) {
      storedI18n = value;

      if (!value) return;

      restoreProperty(w, "i18n", value);
      interceptedTargets.delete(w as object);

      if (value.instance) {
        dispatchInstanceReady();
        return;
      }

      ensureInstanceInterceptor(value);
    },
    configurable: true,
    enumerable: true,
  });
};

const subscribe = (onStoreChange: () => void): (() => void) => {
  const instance = getI18nInstance();

  if (instance) {
    instance.on("languageChanged", onStoreChange);
    return () => {
      instance.off("languageChanged", onStoreChange);
    };
  }

  if (typeof window === "undefined") return () => {};

  ensureI18nSubscriptionSource();

  const onInstanceReady = () => {
    window.removeEventListener(INSTANCE_READY_EVENT, onInstanceReady);
    const inst = getI18nInstance();
    if (inst) {
      inst.on("languageChanged", onStoreChange);
      onStoreChange();
    }
  };

  window.addEventListener(INSTANCE_READY_EVENT, onInstanceReady);

  return () => {
    window.removeEventListener(INSTANCE_READY_EVENT, onInstanceReady);
    getI18nInstance()?.off("languageChanged", onStoreChange);
  };
};

const getSnapshot = (): string => getCurrentCommonLanguage();

const getServerSnapshot = (): string => "en";

/**
 * A React hook that provides a reactive version of `getCommonTranslation`.
 * Listens to the app's i18n instance `languageChanged` event and forces a re-render,
 * ensuring that translated strings update when the language changes.
 *
 * If the i18n instance is not available yet, waits for the host application to expose it.
 *
 * @param namespaces - Namespaces to search in order (defaults to ["Common"])
 */
export const useCommonTranslation = (namespaces?: string[]) => {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = useCallback(
    (key: string, interpolation?: Record<string, unknown>) =>
      getCommonTranslation(key, interpolation, namespaces),
    [lang, namespaces],
  );

  return t;
};
