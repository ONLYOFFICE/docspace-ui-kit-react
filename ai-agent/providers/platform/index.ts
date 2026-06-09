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

import type { PlatformAdapter } from "@onlyoffice/ai-chat";
import { useEffect, useMemo, useRef, useState, useEffectEvent } from "react";

import { PORTAL_BASE_THEME_ID, PORTAL_DARK_THEME_ID } from "../themes";

type EnvChangeInfo = { theme?: string; lang?: string };
type EnvChangeCallback = (info: EnvChangeInfo) => void;

// This module is imported by a Next.js client component, which Next.js still
// evaluates on the server during SSR. Guard every browser-only API so the
// module can load in Node — real values get filled in by useEffect-driven
// notifyEnvironmentChange calls once we hit the client.
const isBrowser = typeof window !== "undefined";

const getSystemTheme = (): "light" | "dark" => {
  if (!isBrowser) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const themeIdForSystem = (t: "light" | "dark") =>
  t === "dark" ? PORTAL_DARK_THEME_ID : PORTAL_BASE_THEME_ID;

export type SaveAsFileHandler = (
  content: string,
  defaultName: string,
) => Promise<void>;

type PlatformFileOperations = NonNullable<PlatformAdapter["file"]>;

const createFileOperations = (
  getHandler: () => SaveAsFileHandler | null | undefined,
): PlatformFileOperations =>
  ({
    saveAsFile: async (content, defaultName) => {
      await getHandler()?.(content, defaultName);
    },
    getRecentFiles: async () => "[]",
  }) as PlatformFileOperations;

type UsePlatformAdapterArgs = {
  // Host UI locale and theme. Changes are pushed into the (stable) adapter and
  // broadcast to the chat library via its onEnvironmentChange subscribers.
  locale: string;
  theme?: string;
  onSaveAsFile?: SaveAsFileHandler;
};

// Returns the platform adapter the chat library needs. The adapter object is
// built once and kept stable (its identity never changes), so downstream chat
// stores aren't rebuilt; host locale/theme and OS theme changes mutate its
// `env` in place and notify subscribers. The save handler is read through a ref
// so the latest `onSaveAsFile` is always used without rebuilding the adapter.
export const usePlatformAdapter = ({
  locale,
  theme,
  onSaveAsFile,
}: UsePlatformAdapterArgs): PlatformAdapter => {
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  const saveAsFileEvent = useEffectEvent<SaveAsFileHandler>(
    (content, defaultName) =>
      onSaveAsFile?.(content, defaultName) ?? Promise.resolve(),
  );

  // Subscribers registered by the library via onEnvironmentChange; stable.
  const subscribers = useRef(new Set<EnvChangeCallback>());

  const adapter = useMemo<PlatformAdapter>(() => {
    const instance: PlatformAdapter = {
      file: createFileOperations(() => saveAsFileEvent),
      process: null,
      hostTools: null,
      clouds: null,
      env: {
        theme: theme ?? themeIdForSystem(getSystemTheme()),
        systemTheme,
        locale,
        devicePixelRatio: isBrowser ? window.devicePixelRatio : 1,
        onEnvironmentChange(callback) {
          subscribers.current.add(callback);

          if (!isBrowser) {
            return () => {
              subscribers.current.delete(callback);
            };
          }

          const mq = window.matchMedia("(prefers-color-scheme: dark)");
          const handler = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light");
          };
          mq.addEventListener("change", handler);

          return () => {
            subscribers.current.delete(callback);
            mq.removeEventListener("change", handler);
          };
        },
      },
    };

    return instance;
  }, [systemTheme, theme, locale]);

  useEffect(() => {
    subscribers.current.forEach((cb) => cb({ lang: locale }));
  }, [locale]);

  useEffect(() => {
    if (!theme) return;
    subscribers.current.forEach((cb) => cb({ theme }));
  }, [theme]);

  return adapter;
};
