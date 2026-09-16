// Pluggable brand-name lookup for the ui-kit library.
//
// The library ships with an identity lookup (returns the key as-is) so
// `getBrandName("ProductName")` yields `"ProductName"` until a consumer
// application wires up real data via setBrandLookup().
//
// DocSpace apps register their lookup by importing
// @docspace/shared/constants/brands, which calls setBrandLookup() as a
// side effect at module load.
//
// The lookup lives on globalThis under a `Symbol.for` key rather than in a
// module-scope `let`, because a module-scope variable is only shared by code
// that loaded the *same copy* of this package. pnpm's isolated layout installs
// one copy per distinct peer-resolution set, and those sets diverge easily: an
// optional peer with a stale range (`openai` asks for `zod: ^3.23.8`) resolved
// one way for the app depending on openai directly and another way for the app
// reaching it through @onlyoffice/ai-chat. That made two openai copies, hence
// two ai-chat copies, hence two copies of this package -- and setBrandLookup
// ran against one while the selectors read the other, so every file-selector
// breadcrumb in the sdk app rendered the literal key "ProductName". A
// realm-global slot survives that: duplication still costs bundle size, but it
// can no longer silently change what the UI renders.

export type BrandLookup = (key: string, locale?: string) => string;

const SLOT = Symbol.for("@onlyoffice/apps-ui-kit#brandLookup");

type Holder = { [SLOT]?: BrandLookup };

const identity: BrandLookup = (key) => key;

export function setBrandLookup(fn: BrandLookup): void {
  (globalThis as Holder)[SLOT] = fn;
}

export function getBrandName(key: string, locale?: string): string {
  return ((globalThis as Holder)[SLOT] ?? identity)(key, locale);
}
