import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";

type Globals = Record<string, unknown>;
type GlobalsEvent = { globals?: Globals; userGlobals?: Globals };
type PreviewUrlGlobal = typeof globalThis & { PREVIEW_URL?: string };

// What Storybook's `globals=` URL parameter accepts as a value; anything else
// it drops with a warning. Objects (viewport, backgrounds) are left out.
const SAFE_STRING = /^[\w-]*$/;

const isPrimitive = (value: unknown): value is string | number | boolean =>
  typeof value === "number" ||
  typeof value === "boolean" ||
  (typeof value === "string" && SAFE_STRING.test(value));

const toGlobalsParam = (globals: Globals): string =>
  Object.entries(globals)
    .filter(([, value]) => isPrimitive(value))
    .map(([key, value]) =>
      typeof value === "boolean" ? `${key}:!${value}` : `${key}:${value}`,
    )
    .join(";");

/**
 * Carries the toolbar globals (API Config, direction) into the stories a Docs
 * page renders in an `iframe.html` of their own (`docs.story.inline: false`).
 * The docs blocks build that iframe's `src` from `PREVIEW_URL` with no
 * `globals`, and the nested preview never hears the manager's, so without
 * this the AI chat and settings on their Docs pages always fell back to
 * `apiConfig: "default"` -- the demo portal -- whatever the toolbar said.
 *
 * Keeping `PREVIEW_URL` carrying the current globals is enough for changes
 * too: a toolbar change re-renders the Docs page, the block's `src` changes
 * with it, and the nested story reloads with the new globals.
 */
export const syncNestedPreviewGlobals = () => {
  const root = globalThis as PreviewUrlGlobal;
  const [base, query] = (root.PREVIEW_URL || "iframe.html").split("?");

  const setPreviewUrl = (event?: GlobalsEvent) => {
    const params = new URLSearchParams(query || "");
    const globals = toGlobalsParam(event?.userGlobals ?? event?.globals ?? {});
    if (globals) params.set("globals", globals);
    const search = params.toString();
    root.PREVIEW_URL = search ? `${base}?${search}` : base;
  };

  const channel = addons.getChannel();
  channel.on(SET_GLOBALS, setPreviewUrl);
  channel.on(GLOBALS_UPDATED, setPreviewUrl);
};
