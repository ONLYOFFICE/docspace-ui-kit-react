// Pluggable constant-name lookup (BetaLabel, OCR, PDF, SSO, etc.).
// See constants/brands.ts for the registration pattern, and for why the lookup
// is held on globalThis rather than in a module-scope variable.

export type ConstLookup = (key: string, locale?: string) => string;

const SLOT = Symbol.for("@onlyoffice/apps-ui-kit#constLookup");

type Holder = { [SLOT]?: ConstLookup };

const identity: ConstLookup = (key) => key;

export function setConstLookup(fn: ConstLookup): void {
  (globalThis as Holder)[SLOT] = fn;
}

export function getConstName(key: string, locale?: string): string {
  return ((globalThis as Holder)[SLOT] ?? identity)(key, locale);
}
