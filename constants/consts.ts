// Pluggable constant-name lookup (BetaLabel, OCR, PDF, SSO, etc.).
// See constants/brands.ts for the registration pattern.

export type ConstLookup = (key: string, locale?: string) => string;

let lookup: ConstLookup = (key) => key;

export function setConstLookup(fn: ConstLookup): void {
  lookup = fn;
}

export function getConstName(key: string, locale?: string): string {
  return lookup(key, locale);
}
