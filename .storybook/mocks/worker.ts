import { http, HttpResponse, type AnyHandler } from "msw";
import { setupWorker, type SetupWorker } from "msw/browser";

import { DEMO_PORTAL_URL } from "./demoPortal";
import { handlers } from "./handlers";

// Anything on the demo portal that no handler answers: a 404 and a warning,
// never a silent `{}` -- an empty success would hide a route the fixtures do
// not cover behind a story that merely looks empty.
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

// On `globalThis` rather than in module scope: a hot reload of this file
// would otherwise start a second worker beside the first, and msw refuses
// ("WebSocket already replaced"). The reloaded module hands the running
// worker its fresh handlers instead.
const state = globalThis as {
  __demoPortal?: { worker: SetupWorker; ready: Promise<unknown> };
};

/**
 * Starts the service worker that plays the demo portal, once per page.
 * Relative to `iframe.html`, so it also works when the static build is
 * served under a path prefix. Requests to any other origin, a real portal
 * included, pass through untouched.
 */
export const startDemoPortal = (extra: AnyHandler[] = []) => {
  const all = [...extra, ...handlers, unhandled];
  if (state.__demoPortal) {
    state.__demoPortal.worker.resetHandlers(...all);
  } else {
    const worker = setupWorker(...all);
    const ready = worker
      .start({
        serviceWorker: { url: "./mockServiceWorker.js" },
        onUnhandledFrame: "bypass",
        quiet: true,
      })
      .catch((error: unknown) => {
        // Without a worker the stories still render, into the "failed" state
        // of whatever they gate on; say why once instead of on every call.
        console.error(
          "[demo portal] the mock service worker did not start",
          error,
        );
      });
    state.__demoPortal = { worker, ready };
  }
  return state.__demoPortal.ready;
};
