# Change Log

## 4.0.0

First release of this package under its own name and from its own repository. It was
`@docspace/ui-kit@0.0.1`, a workspace package of the DocSpace client resolved to its source
root; it is now `@onlyoffice/apps-ui-kit`, built and consumed as a package. The version
aligns with the DocSpace 4.0 line rather than continuing the old numbering.

Everything under *Changed* is breaking for a consumer that previously resolved the source
tree.

## Changed

- **Renamed** from `@docspace/ui-kit` to `@onlyoffice/apps-ui-kit`
- **ESM only.** The published manifest declares `type: module`; the build emits
  `dist/esm/**` and `dist/types/**`. There is no CJS output and no `dist/cjs`
- **Declarations are `.d.mts`**, matching the `import` condition
- **An `exports` map now decides what resolves.** Six keys: `.`, `./styles.css`,
  `./package.json`, `./locales/*`, `./styles/*`, and one `./*` wildcard that serves every
  module subpath onto `<subpath>/index.js`. Anything it does not cover stops resolving —
  including a plain (non-module) stylesheet, which is emitted as `<Name>.scss/index.css`
  with no `index.js` beside it and has to be reached through the module that imports it
- **One CSS file per module, imported by that module.** A consumer importing a component
  pulls in that component's CSS and nothing else, and its bundler splits styles along the
  same chunk boundaries as the code. `dist/styles.css` is still assembled, in module-graph
  order, for consumers that want the whole sheet
- **Dependencies are split three ways.** 32 `dependencies` for the public core;
  `react`, `react-dom`, `i18next` and `react-i18next` as required peers; 15 optional peers
  for what only the portal-internal modules need (`@onlyoffice/ai-chat`, `mobx`,
  `mobx-react`, `axios`, `socket.io-client`, `@socket.io/component-emitter`, `react-router`,
  the markdown and KaTeX stack, `@onlyoffice/document-editor-react`). An external install
  downloads none of the optional set
- `@onlyoffice/docspace-api-sdk` resolves from npm as `^3.7.0` instead of a vendored
  `file:` tarball
- `react` and `react-dom` peers relaxed to `^19.0.0`
- Moved to `i18next` 25 and `react-i18next` 15; `react-svg` to 16.4.2
- `providers/api` and the composed `providers/Providers` left `providers/index.ts`. Both
  are portal-specific — `Providers` fetches portal settings on mount — and both remain
  importable by subpath
- The `hooks` barrel is exported from the root
- Licence declaration moved out of the source files: the package is still AGPL-3.0-only,
  declared in `package.json`, `LICENSE` and the README, with no per-file headers

## Added

- `locales/en` is committed, so the package builds, tests and runs Storybook with no
  DocSpace checkout beside it. The other languages are refreshed on demand with
  `pnpm sync-locales`, which needs a client checkout and fails loudly without one
- `pnpm verify:package` — packs with pnpm, then runs `publint` and `attw` against the real
  tarball. It must be pnpm: `publishConfig` field overrides are a pnpm feature, and an
  npm-packed tarball has no `exports` and no `main` at all
- `scripts/check-dist.mjs`, at the end of `pnpm build`: fails on a bundled dependency, on a
  chunk that is not an `index` file (which no `exports` pattern would match), and on a
  module that lost its `"use client"` directive — rollup drops module-level directives when
  bundling, and without them every Next.js App Router consumer breaks on the first
  interactive component
- A CI job that builds the package and runs the packaging gate. Blocking
- `docs/public-api.md` — what is public, what is portal-internal, and what neither
  guarantees
- Stories for `QuantityPicker`, the avatar editor dialog and the room logo cover dialog;
  visual-regression specs for `Selector` and `Table`
- `ui-kit.code-workspace` and `.vscode/` — tasks for the build, the checks, Storybook, the
  E2E suite and the audit scripts, behind grouped status-bar buttons

## Removed

- `react-virtualized-auto-sizer` and `@babel/runtime` — neither is imported, and the build
  does not miss them
- The monorepo paths, aliases and submodule wiring the package carried while it lived
  inside the client

## Fixed

- `ImageEditor` no longer crashes on render
- Built icons keep their `viewBox`
- `RoomLogo` regained a class name it needed
- Storybook stories repaired across `ActionButton`, `AppLoader`, `Aside`, `DragAndDrop`,
  `DropDown`, `FloatingButton`, `InfiniteLoader`, `Navigation`, `Portal`, `RadioButton`,
  `Row`, `Table` and `TopLoadingIndicator`, plus the story globs and the sidebar order
- Brand and constant lookups are held on `globalThis`, so they survive a second module
  instance
- `pnpm build` no longer needs a DocSpace checkout

## Known issues

- **`axios` is not portal-only.** `docs/public-api.md` says it is; the root barrel reaches
  it through `uploader` and `billing`, both of which are exported from `index.ts`. Since
  `axios` is an optional peer, a consumer who bundles the barrel themselves must install it.
  The portal is unaffected
- `i18next` and `react-i18next` are required peers with no `devDependency` mirror here, so
  this repository's own tests run against whatever version resolves transitively
