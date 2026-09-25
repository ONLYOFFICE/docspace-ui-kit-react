import type { ChatCallbacks } from "@onlyoffice/ai-chat";

type Handler = (data: never) => void;

/**
 * Merges the providers' own chat callbacks with the host's.
 *
 * The widget takes one callbacks object and replaces it wholesale
 * (`EventsProvider` calls `setCallbacks(callbacks ?? {})`), so a provider that
 * needs an event of its own cannot simply pass its handler down — it would
 * drop every handler the host registered. Every key present in either object
 * ends up calling both.
 *
 * Ours runs first, so by the time the host's handler sees the event the
 * provider state it may read (the analyze mode) has already settled. A throw
 * from ours must not cost the host its notification, hence the `finally`:
 * these are notifications, not a pipeline. The error still propagates once
 * both have run — swallowing it would hide a broken handler.
 */
export const composeCallbacks = (
  host: ChatCallbacks | undefined,
  own: ChatCallbacks,
): ChatCallbacks => {
  if (!host) return own;

  const keys = new Set([...Object.keys(host), ...Object.keys(own)]);
  const merged: Record<string, Handler> = {};

  keys.forEach((key) => {
    const ownHandler = Reflect.get(own, key);
    const hostHandler = Reflect.get(host, key);

    if (typeof ownHandler !== "function") {
      if (typeof hostHandler === "function") merged[key] = hostHandler;
      return;
    }
    if (typeof hostHandler !== "function") {
      merged[key] = ownHandler;
      return;
    }

    merged[key] = (data: never) => {
      try {
        ownHandler(data);
      } finally {
        hostHandler(data);
      }
    };
  });

  return merged;
};
