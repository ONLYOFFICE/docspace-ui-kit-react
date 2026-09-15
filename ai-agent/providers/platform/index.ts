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

export type OpenFileHandler = (path: string, name: string) => void;

type PlatformFileOperations = NonNullable<PlatformAdapter["file"]>;

const createFileOperations = (
  getSaveHandler: () => SaveAsFileHandler | null | undefined,
  getOpenHandler: () => OpenFileHandler | null | undefined,
): Partial<PlatformFileOperations> => ({
  saveAsFile: async (content, defaultName) => {
    await getSaveHandler()?.(content, defaultName);
  },
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
  onOpenFile,
}: UsePlatformAdapterArgs): PlatformAdapter => {
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  const saveAsFileEvent = useEffectEvent<SaveAsFileHandler>(
    (content, defaultName) =>
      onSaveAsFile?.(content, defaultName) ?? Promise.resolve(),
  );

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
      ),
      process: null,
      // Registered MCP servers are executed by the Node AI service (their
      // tools come back via api.tools.listSystemTools); the widget must not
      // also start them in the browser — that connected each server twice
      // and rendered a duplicate permission card.
      customServersExecutedByHost: true,
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
