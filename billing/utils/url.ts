/**
 * Ensures the URL is absolute by prepending "/" if it has no scheme or leading slash.
 */
export const toAbsoluteUrl = (url: string): string =>
  url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;

export function getTwoDotsReplacing(translation: string) {
  return translation.replace(/\..$/, ".");
}
