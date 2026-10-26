/**
 * Which string icons `react-svg` may fetch and inline. The fetch is an XHR
 * and the result lands in the page's DOM, so it is limited to an SVG the page
 * already trusts: a data URL, or a `.svg` on its own origin. Anything else, a
 * cross-origin `.svg` included, is drawn by an `<img>`, which needs no CORS
 * headers on the host and runs nothing. Shared by `DropDownItem` and both
 * forms of the context menu.
 */

const SVG_PATH = /\.svg(?:[?#]|$)/i;
const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|[\\/]{2})/i;

export const isSvgDataUrl = (src: string): boolean =>
  src.startsWith("data:image/svg+xml");

/**
 * A `.svg` on the page's own origin, a web plugin's asset excepted. With no
 * `window` (on the server) a relative URL counts as same-origin.
 */
export const isInlinedSvgUrl = (src: string): boolean => {
  if (!SVG_PATH.test(src) || src.includes("webplugins")) return false;

  if (typeof window === "undefined") return !ABSOLUTE_URL.test(src);

  try {
    return new URL(src, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
};
