// A handful of external CJS dependencies ship only a minified UMD build with
// no `exports` map, so `main` points straight at it. Node's `cjs-module-lexer`
// -- the static scanner that synthesises named exports for a CJS module
// viewed from ESM -- cannot parse the mangled `exports.default = ...` (or
// Babel's `exports.__esModule = true; exports.default = ...`) assignment
// inside a minified bundle, so the synthetic namespace it builds puts the
// *entire* `module.exports` object behind `.default` a second time, instead
// of the actual default export. `import X from "pkg"` then silently binds
// `X` to `{ ...everything, default: <the real thing> }` rather than the real
// thing itself.
//
// This only happens under Node's own ESM resolver -- Vitest included, since
// it resolves a package the same way a plain `node --experimental-vm-modules`
// run would. Bundler dev/prod builds (Vite's esbuild pre-bundling, webpack)
// use their own CJS/ESM interop and are not affected, but the package still
// has to behave correctly under Node for tests and any Node-side rendering
// (Next.js SSR) to work.
//
// Call this on `import * as ns from "pkg"` for any package whose default
// export turns out to need it (confirmed case by case -- most CJS
// dependencies are detected correctly and must not be run through this).
export function interopDefault<T>(namespace: { default: T }): T {
  const value = namespace.default as unknown;

  const isDoubleWrapped =
    typeof value === "object" && value !== null && "default" in value;

  return isDoubleWrapped ? (value as { default: T }).default : (value as T);
}
