// Pluggable brand-name lookup for the ui-kit library.
//
// The library ships with an identity lookup (returns the key as-is) so
// `getBrandName("ProductName")` yields `"ProductName"` until a consumer
// application wires up real data via setBrandLookup().
//
// DocSpace apps register their lookup by importing
// @docspace/shared/constants/brands, which calls setBrandLookup() as a
// side effect at module load.

export type BrandLookup = (key: string, locale?: string) => string;

let lookup: BrandLookup = (key) => key;

export function setBrandLookup(fn: BrandLookup): void {
  lookup = fn;
}

export function getBrandName(key: string, locale?: string): string {
  return lookup(key, locale);
}
