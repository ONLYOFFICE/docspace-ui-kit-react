import { http, HttpResponse } from "msw";

import lightSmallLogo from "../../../assets/logo/lightsmall.svg?raw";
import darkLightSmallLogo from "../../../assets/logo/dark_lightsmall.svg?raw";
import darkLogoMark from "../../../assets/logo/dark_leftmenu.svg?raw";

import { DEMO_PORTAL_URL } from "../demoPortal";

// `WhiteLabelLogoType.Favicon`: the square mark, not the wordmark.
const FAVICON = "3";
const LEFT_MENU = "6";

// The ONLYOFFICE mark is the first 48 units of the light wordmark; cropping
// the viewBox gives the square logo without a second copy of the artwork.
const lightLogoMark = lightSmallLogo.replace(
  /<svg[^>]*>/,
  '<svg width="24" height="24" viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
);

const svg = (body: string) =>
  new HttpResponse(body, {
    headers: { "Content-Type": "image/svg+xml" },
  });

const logoFor = (params: URLSearchParams) => {
  const isDark = params.get("dark") === "true";
  if (params.get("logotype") === FAVICON) {
    return isDark ? darkLogoMark : lightLogoMark;
  }
  if (params.get("logotype") === LEFT_MENU) return darkLogoMark;
  return isDark ? darkLightSmallLogo : lightSmallLogo;
};

export const demoLogoDataUrl = (src: string) => {
  if (!src.startsWith(`${DEMO_PORTAL_URL}/logo.ashx`)) return null;
  const body = logoFor(new URL(src).searchParams);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(body)}`;
};

/**
 * The portal's white-label logos, `logo.ashx?logotype=<WhiteLabelLogoType>`,
 * which anything drawing the portal's brand asks for -- the system MCP
 * server's icon, for one. The demo portal answers every type with the kit's
 * own ONLYOFFICE logo: the square mark for the favicon, the wordmark for the
 * rest.
 */
export const portalHandlers = [
  http.get(`${DEMO_PORTAL_URL}/logo.ashx`, ({ request }) =>
    svg(logoFor(new URL(request.url).searchParams)),
  ),
];
