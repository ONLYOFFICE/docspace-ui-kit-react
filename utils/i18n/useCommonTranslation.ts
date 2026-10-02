import { useSyncExternalStore, useCallback } from "react";

import { getCurrentCommonLanguage, getCommonTranslation } from "./i18n-utils";
import type { WindowI18n } from "./i18n-utils";

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
