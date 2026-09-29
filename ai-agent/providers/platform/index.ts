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

import type { ExportFormat, PlatformAdapter } from "@onlyoffice/ai-chat";
import { useEffect, useMemo, useRef, useState, useEffectEvent } from "react";

import { toastr } from "../../../components/toast";

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

// Shared empty list: a host that declares no formats must not hand the
// library a fresh array on every render.
const EMPTY_FORMATS: ExportFormat[] = [];

const themeIdForSystem = (t: "light" | "dark") =>
  t === "dark" ? PORTAL_DARK_THEME_ID : PORTAL_BASE_THEME_ID;

const showHostToast = (text: string) => {
  toastr.success(text);
};

export type SaveAsFileHandler = (
  content: string,
  defaultName: string,
  // `ExportFormat.id` picked from the chat's export submenu. Absent for the
  // plain "Save" action (a single message's download button), where the
  // extension in `defaultName` is the only hint.
  format?: string,
) => Promise<void>;

export type OpenFileHandler = (path: string, name: string) => void;

type PlatformFileOperations = NonNullable<PlatformAdapter["file"]>;

const createFileOperations = (
  getSaveHandler: () => SaveAsFileHandler | null | undefined,
  getOpenHandler: () => OpenFileHandler | null | undefined,
  getExportFormats: () => ExportFormat[],
): Partial<PlatformFileOperations> => ({
  saveAsFile: async (content, defaultName, format) => {
    await getSaveHandler()?.(content, defaultName, format);
  },
  // Declaring more than one format makes the library replace the thread's
  // single "Download" item with an "Export to…" submenu and pass the chosen
  // `id` back through `saveAsFile`. Called during render, so it must stay
  // synchronous and cheap.
  getExportFormats,
  // Fired by the library when the user clicks a file chip on a sent message.
  openFile: (path, name) => {
    getOpenHandler()?.(path, name);
  },
});

type UsePlatformAdapterArgs = {
  // Host UI locale and theme. Changes are pushed into the (stable) adapter and
  // broadcast to the chat library via its onEnvironmentChange subscribers.
  locale: string;
  theme?: string;
  onSaveAsFile?: SaveAsFileHandler;
  onOpenFile?: OpenFileHandler;
  // Export formats offered for a chat thread. Their labels are localized by
  // the host, so they are read through a ref on every call rather than
  // captured — and the adapter is rebuilt on a locale change anyway, which is
  // what re-runs the library's own memo over this list.
  exportFormats?: ExportFormat[];
};

// Returns the platform adapter the chat library needs. The adapter object is
// memoized on the host locale and theme alone, so downstream chat stores are
// not rebuilt by anything else; `env` is mutated in place and subscribers are
// notified. The save handler is read through a ref so the latest
// `onSaveAsFile` is always used without rebuilding the adapter.
export const usePlatformAdapter = ({
  locale,
  theme,
  onSaveAsFile,
  onOpenFile,
  exportFormats,
}: UsePlatformAdapterArgs): PlatformAdapter => {
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  const saveAsFileEvent = useEffectEvent<SaveAsFileHandler>(
    (content, defaultName, format) =>
      onSaveAsFile?.(content, defaultName, format) ?? Promise.resolve(),
  );

  // A ref rather than a `useEffectEvent` like the handlers above: the library
  // calls `getExportFormats` while rendering the chat list, and an effect
  // event throws when it is called during render.
  const exportFormatsRef = useRef<ExportFormat[]>(
    exportFormats ?? EMPTY_FORMATS,
  );
  exportFormatsRef.current = exportFormats ?? EMPTY_FORMATS;

  const openFileEvent = useEffectEvent<OpenFileHandler>((path, name) => {
    onOpenFile?.(path, name);
  });

  // Subscribers registered by the library via onEnvironmentChange; stable.
  const subscribers = useRef(new Set<EnvChangeCallback>());

  const adapter = useMemo<PlatformAdapter>(() => {
    const instance: PlatformAdapter = {
      file: createFileOperations(
        () => saveAsFileEvent,
        () => openFileEvent,
        () => exportFormatsRef.current,
      ),
      process: null,
      // Registered MCP servers are executed by the Node AI service (their
      // tools come back via api.tools.listSystemTools); the widget must not
      // also start them in the browser — that connected each server twice
      // and rendered a duplicate permission card.
      customServersExecutedByHost: true,
      hostTools: null,
      clouds: null,
      showToast: showHostToast,
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

