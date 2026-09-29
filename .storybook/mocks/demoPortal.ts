import { HttpResponse } from "msw";

// The portal every story talks to when the API Config toolbar names none.
// `.invalid` is reserved (RFC 2606), so nothing outside the service worker can
// ever answer it: a request the handlers miss fails instead of reaching some
// real host. Everything under it is fake, and the stories say so.
export const DEMO_PORTAL_URL = "https://demo-portal.invalid";

// Sent as the bearer token so the clients are built exactly as for a real
// portal; the handlers never look at it.
export const DEMO_API_KEY = "demo-key";

/** `/api/2.0/<path>` on the demo portal, as an MSW path pattern. */
export const api = (path: string) =>
  `${DEMO_PORTAL_URL}/api/2.0/${path.replace(/^\/+/, "")}`;

/**
 * The envelope every portal answer comes in: the SDK clients read
 * `data.response`, and the list endpoints also `count` and `total`.
 */
export const ok = <T>(
  response: T,
  extra: { count?: number; total?: number } = {},
) =>
  HttpResponse.json({
    response,
    count: extra.count ?? (Array.isArray(response) ? response.length : 1),
    total: extra.total ?? (Array.isArray(response) ? response.length : 1),
    status: 0,
    statusCode: 200,
  });

/** A portal refusal, in the same envelope. */
export const fail = (status: number, message: string) =>
  HttpResponse.json(
    { error: { message }, status: 1, statusCode: status },
    { status },
  );

/** `startIndex` and `count` from a list query, the portal's paging pair. */
export const paging = (url: URL) => {
  const startIndex = Number(url.searchParams.get("startIndex") ?? 0) || 0;
  const count = Number(url.searchParams.get("count") ?? 100) || 100;
  return { startIndex, count };
};

/** One page of `items`, with the envelope's `total` set to all of them. */
export const page = <T>(items: T[], url: URL) => {
  const { startIndex, count } = paging(url);
  const slice = items.slice(startIndex, startIndex + count);
  return { slice, total: items.length };
};

/** A fixed timestamp a few days back, so dates in the fixtures look lived-in. */
export const daysAgo = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
