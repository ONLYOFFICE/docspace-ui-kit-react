import { http, HttpResponse, type AnyHandler } from "msw";
import {
  defineNetwork,
  InterceptorSource,
  type NetworkApi,
} from "msw/experimental";
import { FetchInterceptor } from "@mswjs/interceptors/fetch";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/XMLHttpRequest";

import { DEMO_PORTAL_URL } from "./demoPortal";
import { handlers } from "./handlers";
import { demoLogoDataUrl } from "./handlers/portal";

const unhandled = http.all(`${DEMO_PORTAL_URL}/*`, ({ request }) => {
  console.warn(
    `[demo portal] no fixture for ${request.method} ${request.url.replace(DEMO_PORTAL_URL, "")}`,
  );
  return HttpResponse.json(
    {
      error: { message: "Not in the demo portal's fixtures" },
      statusCode: 404,
    },
    { status: 404 },
  );
});

type DemoNetwork = NetworkApi<InterceptorSource[]>;

const state = globalThis as {
  __demoPortal?: { network: DemoNetwork };
};

const unregisterLegacyWorker = async () => {
  if (!("serviceWorker" in navigator)) return;

  const scope = new URL("./", window.location.href).href;
  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations
      .filter((registration) => {
        const worker =
          registration.active ??
          registration.waiting ??
          registration.installing;
        return (
          registration.scope === scope &&
          worker?.scriptURL.endsWith("/mockServiceWorker.js")
        );
      })
      .map((registration) => registration.unregister()),
  );
};

const swapDemoImages = () => {
  document
    .querySelectorAll<HTMLImageElement>(`img[src^="${DEMO_PORTAL_URL}/"]`)
    .forEach((img) => {
      const src = demoLogoDataUrl(img.src);
      if (src) img.src = src;
    });
};

const observeDemoImages = () => {
  swapDemoImages();
  new MutationObserver(swapDemoImages).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src"],
  });
};

export const startDemoPortal = async (extra: AnyHandler[] = []) => {
  const all = [...extra, ...handlers, unhandled];

  if (state.__demoPortal) {
    state.__demoPortal.network.resetHandlers(...all);
    return;
  }

  const network = defineNetwork({
    sources: [
      new InterceptorSource({
        interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()],
      }),
    ],
    handlers: all,
    context: { quiet: true },
    onUnhandledFrame: "bypass",
  });

  network.enable();
  state.__demoPortal = { network };

  observeDemoImages();

  unregisterLegacyWorker().catch(() => {});
};
