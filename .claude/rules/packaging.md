---
paths:
  - "package.json"
  - "rollup.config.mjs"
  - "tsconfig*.json"
  - "scripts/**"
  - "index.ts"
  - "**/index.ts"
  - "**/index.tsx"
---

# Packaging: what a consumer actually resolves

There is no client build compiling these sources any more. `pnpm lint`, `pnpm tsc` and
`pnpm test` say nothing about whether the package installs, resolves or renders. Only
`pnpm build` (which ends in `scripts/check-dist.mjs`) and `pnpm verify:package` do, and both
run in CI as the blocking `package` job.

```bash
pnpm build            # rollup -> tsc -> normalize-types -> finalize-dist -> order-styles -> check-dist
pnpm verify:package   # pnpm pack, then publint + attw against the real tarball
```

**`verify:package` must pack with pnpm.** `publishConfig` field overrides are a pnpm feature;
an `npm pack` tarball has no `exports` and no `main` at all, and every check then fails for the
wrong reason. This is also why `attw --pack .` is useless here.

## The published shape

ESM only. `dist/esm/**` (JavaScript), `dist/types/**` (declarations, `.d.mts`), one assembled
`dist/styles.css`. **There is no `dist/cjs`.** `publishConfig` flips `type` to `module` and
installs the `exports` map — the source `package.json` says `"type": "commonjs"`, so reading
the source manifest tells you nothing about what ships.

One wildcard serves every subpath:

```json
"./*": { "types": "./dist/types/*/index.d.mts", "default": "./dist/esm/*/index.js" }
```

That works only because **every emitted module is an `index` file**. `entryFileNames` maps
`x.ts` to `x/index.js`, so a tree containing both `x.ts` and `x/index.ts` collides; rollup does
not fail, it renames the loser to `index2.js`, which no subpath resolves to. `check-dist.mjs`
catches that — do not add a source file whose name duplicates a sibling directory.

A note cannot be added inside `exports`: Node rejects an object mixing subpath keys with a key
not starting with `.` (`ERR_INVALID_PACKAGE_CONFIG`). The commentary lives in the sibling
`"//publishConfig.exports"` field.

## Every dependency stays external

`rollup.config.mjs` externalises everything in `dependencies` and `peerDependencies`.
`check-dist.mjs` fails the build if `node_modules/` or `_virtual/` appears in `dist` — a
vendored second copy is fatal for anything holding module state (i18next, mobx) and merely
wasteful otherwise.

Where a new package goes:

| The importer is                                                                                                                           | Declare it as                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| public core (`components`, `utils`, `hooks`, `context`, `providers/theme                                                                  | translation                                              | error-boundary`, `errors`) | `dependencies` |
| a portal-internal module only (`ai-agent`, `billing`, `selectors`, `uploader`, `api`, `providers/api`, `utils/socket`, `document-editor`) | **optional** `peerDependencies` + `peerDependenciesMeta` |
| React / React-DOM                                                                                                                         | required peer, never bundled, never a dependency         |

Every non-required peer is mirrored in `devDependencies` — pnpm does not install peers, so the
build, tests and Storybook need a concrete copy. `@onlyoffice/ai-chat`'s own optional peers
(assistant-ui, radix, codemirror, the LLM vendor SDKs) are deliberately **absent**: nothing
here imports them, and a copy would only pretend otherwise.

Adding a dependency that nothing imports — or removing the last import while leaving the entry
— fails the client's pre-push gate, not anything here. See [source-checks.md](source-checks.md).

## CSS ships per module

`scripts/rollup/per-module-css.mjs` emits `Button.module.scss/index.js` (the class-name map,
beginning with `import "./index.css"`) plus `index.css` beside it. A consumer importing a
component pulls that component's CSS and nothing else. `scripts/order-styles.mjs` then
assembles `dist/styles.css` for consumers who want the bundle, in post-order — which matters,
because ~420 cross-module `:global` overrides in this package have identical specificity and
are separated only by cascade order.

Consequence for `sideEffects`: the `**/*.scss/index.js` proxies must be listed, or a bundler
tree-shakes an unused class-name map and drops the stylesheet import with it.

## `"use client"`

55 modules carry the directive. Rollup drops module-level directives while bundling and warns
once per file, invisibly. `preserveUseClient` restores it per chunk and `check-dist.mjs`
asserts a match **by module name**, not by count — equal totals can hide one module losing the
directive while another gains it. Without it, every Next.js App Router consumer breaks on the
first interactive component.

## Not in any gate

`pnpm format` (Prettier) — Biome's formatter is disabled, so files can be and are
Prettier-nonconforming with everything green. `pnpm sync-locales` and `pnpm sync-images` are
manual and need a DocSpace checkout (`DOCSPACE_CLIENT_ROOT`, default `../../DocSpace/client`).
