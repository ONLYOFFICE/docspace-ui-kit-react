import {
  AI_ENUM,
  AI_SEARCH,
  AI_SEARCH_ENUM,
  AI_TOOLS,
  BACKUP_SERVICE,
  DISK_STORAGE,
  STORAGE_ENUM,
  TOTAL_SIZE,
} from "../constants";
import { isDocsConnectServiceName } from "./docs-connect";
import type { TPaymentRoutes } from "../types";

/**
 * Services are identified by two different vocabularies: quota feature ids
 * (`total_size`, `aitools`) on the service cards, and backend service names
 * (`disk-storage`, `ai-tools`) in the wallet, usage and tariff endpoints.
 * Both are listed here so callers can pass whichever one they hold.
 */
const ROUTE_KEY_BY_SERVICE: Record<string, keyof TPaymentRoutes> = {
  [AI_ENUM]: "aiServices",
  [AI_TOOLS]: "aiServices",
  [AI_SEARCH_ENUM]: "aiSearch",
  [AI_SEARCH]: "aiSearch",
  [BACKUP_SERVICE]: "backup",
  [TOTAL_SIZE]: "diskStorage",
  [DISK_STORAGE]: "diskStorage",
  [STORAGE_ENUM]: "diskStorage",
};

/**
 * Resolves the settings route for a billable service, or undefined when the
 * service has no dedicated page.
 */
export const getServiceRoute = (
  routes: TPaymentRoutes,
  service: string,
): string | undefined => {
  const key = (service ?? "").toLowerCase();

  if (isDocsConnectServiceName(key))
    return routes.docsConnect || routes.services;

  const routeKey = ROUTE_KEY_BY_SERVICE[key];

  return routeKey ? routes[routeKey] : undefined;
};

/**
 * Ensures the URL is absolute by prepending "/" if it has no scheme or leading slash.
 */
export const toAbsoluteUrl = (url: string): string =>
  url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;

export function getTwoDotsReplacing(translation: string) {
  return translation.replace(/\..$/, ".");
}
