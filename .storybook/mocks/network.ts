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

// `network` is null when the interceptor failed to start: the failure is
// remembered so later stories neither retry it nor report it again.
const state = globalThis as {
  __demoPortal?: { network: DemoNetwork | null };
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

const UPLOAD_BYTES_PER_MS = 1024;
const MIN_UPLOAD_MS = 1500;

const formDataSize = (body: FormData) => {
  let size = 0;
  for (const [, value] of body) {
    size += value instanceof Blob ? value.size : value.length;
  }
  return size;
};

type ProgressListener = (event: ProgressEvent) => void;

const sendSlowly = (
  xhr: XMLHttpRequest,
  body: FormData,
  listeners: ProgressListener[],
) => {
  const total = formDataSize(body);
  const duration = Math.max(MIN_UPLOAD_MS, total / UPLOAD_BYTES_PER_MS);
  const started = performance.now();

  const tick = () => {
    const loaded = Math.min(
      total,
      ((performance.now() - started) / duration) * total,
    );
    const event = new ProgressEvent("progress", {
      lengthComputable: true,
      loaded,
      total,
    });
    for (const listener of listeners) listener(event);
    if (loaded < total) setTimeout(tick, 100);
    else xhr.send(body);
  };

  tick();
};

const throttleDemoUploads = () => {
  globalThis.XMLHttpRequest = new Proxy(globalThis.XMLHttpRequest, {
    construct(target, args) {
      const xhr: XMLHttpRequest = Reflect.construct(target, args);
      let isDemoPost = false;
      const progressListeners: ProgressListener[] = [];

      return new Proxy(xhr, {
        get(request, property) {
          if (property === "upload") {
            return new Proxy(request.upload, {
              get(upload, name) {
                if (name === "addEventListener") {
                  return (
                    type: string,
                    listener: ProgressListener,
                    ...rest: unknown[]
                  ) => {
                    if (type === "progress") progressListeners.push(listener);
                    return Reflect.apply(upload.addEventListener, upload, [
                      type,
                      listener,
                      ...rest,
                    ]);
                  };
                }
                const value = Reflect.get(upload, name);
                return typeof value === "function" ? value.bind(upload) : value;
              },
              set(upload, name, value) {
                return Reflect.set(upload, name, value);
              },
            });
          }
          if (property === "open") {
            return (method: string, url: string | URL, ...rest: unknown[]) => {
              isDemoPost =
                method.toUpperCase() === "POST" &&
                String(url).startsWith(DEMO_PORTAL_URL);
              return Reflect.apply(request.open, request, [
                method,
                url,
                ...rest,
              ]);
            };
          }
          if (property === "send") {
            return (body?: Document | XMLHttpRequestBodyInit | null) => {
              if (isDemoPost && body instanceof FormData) {
                sendSlowly(request, body, progressListeners);
              } else {
                request.send(body);
              }
            };
          }
          const value = Reflect.get(request, property);
          return typeof value === "function" ? value.bind(request) : value;
        },
        set(request, property, value) {
          return Reflect.set(request, property, value);
        },
      });
    },
  });
};

export const startDemoPortal = async (extra: AnyHandler[] = []) => {
  const all = [...extra, ...handlers, unhandled];

  if (state.__demoPortal) {
    state.__demoPortal.network?.resetHandlers(...all);
    return;
  }

  let network: DemoNetwork;
  try {
    network = defineNetwork({
      sources: [
        new InterceptorSource({
          interceptors: [
            new FetchInterceptor(),
            new XMLHttpRequestInterceptor(),
          ],
        }),
      ],
      handlers: all,
      context: { quiet: true },
      onUnhandledFrame: "bypass",
    });

    network.enable();
  } catch (error) {
    // Without the interceptor the stories still render, into the "failed"
    // state of whatever they gate on; say why once instead of on every story.
    console.error("[demo portal] the request interceptor did not start", error);
    state.__demoPortal = { network: null };
    return;
  }

  throttleDemoUploads();
  state.__demoPortal = { network };

  observeDemoImages();

  unregisterLegacyWorker().catch(() => {});
};
