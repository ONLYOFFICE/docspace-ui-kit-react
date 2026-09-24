# Public API

What `@onlyoffice/apps-ui-kit` promises to external consumers, what it keeps for the
DocSpace portal, and what it guarantees about neither.

**Status:** largely landed. The `exports` map, the dependency split and the build that serves
them are in the tree; what remains open is listed at the end, and one thing this document
claimed has turned out not to be true — see _Dependency consequences_. Counts verified against
`feature/ui-kit-separation` and a DocSpace-client checkout on the same branch.

## Why this exists

Nothing used to distinguish public API from internals. All six monorepo apps resolved
`@onlyoffice/apps-ui-kit` to the **source root** — a `node_modules` symlink plus an explicit
webpack alias in the Next.js apps — so with no `exports` map, any path inside the package was
importable, and there was no way to change anything without guessing who depended on it.

Publishing forced the question. An `exports` map declares what resolves; everything else stops
being reachable. The client now consumes a packed tarball
(`file:../../onlyoffice-apps-ui-kit.tgz`, declared by both `packages/client` and
`packages/shared`), so that enforcement is live: 4 060 deep-subpath import sites across 1 575
files resolve through the map rather than through a symlink.

**The barrel is a second contract, and a stricter one.** DocSpace plugins never install this
package: the portal re-exports the root barrel to them in one line and refuses every subpath,
so `index.ts` is the whole plugin UI API and dropping a name from it breaks plugins with no
compile error in either repository. The client barely uses the barrel — 11 import sites against
4 060 subpath ones — which is why a barrel change can look harmless here and in the client and
still be breaking. `docs/plugin-surface.json` records that surface name by name;
`.claude/rules/plugin-api.md` has the mechanism.

## Tiers

| Tier                | Meaning                                                                                    | Guarantee                                                  |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Public**          | Documented, published, supported for external use                                          | Semver. Breaking changes need a major and a migration note |
| **Portal-internal** | **Ships in the published package** and resolves, but is not part of the supported contract | None. May change or move in any release, without a major   |
| **Private**         | Implementation detail                                                                      | Not resolvable at all once the `exports` map lands         |

## Public surface

| Module                        | Contents                                    | Notes                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components`                  | 98 component folders                        | The bulk of the value. Includes the generic `selector` component (distinct from `selectors/`)                                                                                                                |
| `utils`                       | Helpers re-exported from `utils/index.ts`   | The barrel only. `utils/socket` is **not** public — see below                                                                                                                                                |
| `hooks`                       | 11 hooks                                    | Barrelled in `hooks/index.ts` and exported from the root. `useViewEffect` is a default export, re-exported by name                                                                                           |
| `context`                     | `ThemeContext`, `InterfaceDirectionContext` |                                                                                                                                                                                                              |
| `enums`, `constants`, `types` | Shared enums, constants, type definitions   |                                                                                                                                                                                                              |
| `errors`                      | Error page components (401, 403, 404, …)    | Self-contained, no portal coupling                                                                                                                                                                           |
| `styles`                      | Global SCSS, mixins, variables              | Needed by consumers who extend the design system                                                                                                                                                             |
| `assets`                      | Icon set as React components                | **Subpath-only, deliberately.** Hundreds of SVG modules; a barrel would defeat tree-shaking and force every consumer to parse the whole set. Licensing of the assets themselves is a separate question (D12) |
| `providers/theme`             | `ThemeProvider`, theme objects, `useTheme`  |                                                                                                                                                                                                              |
| `providers/translation`       | `TranslationProvider`, i18n wiring          |                                                                                                                                                                                                              |
| `providers/error-boundary`    | `ErrorBoundary`                             |                                                                                                                                                                                                              |

### The barrel was a subset of the folders, and is not any more

Both barrels under-exported for reasons nobody recorded. `components/index.ts` listed 68 of the
98 folders, leaving `table`, `selector`, `password-input`, `color-picker`, `image-editor`,
`navigation`, `section`, `article`, `main-button` and 21 more reachable only by subpath — so
unreachable from a plugin. `utils/index.ts` listed 18 of 35, missing the whole `date` module,
`combineUrl`, `cookie`, `getLogoUrl`, `openingNewTab`, `presentInArray`, `getOAuthToken`,
`getSystemTheme` and the `iconSize*` helpers. `constants/index.ts` re-exported none of its
neighbours (`CHAT_SUPPORTED_FORMATS`, the brand and const lookups), and `billing/index.ts` left
out its tariff constants.

None of those had a portal dependency, an optional peer or an import of `api`/`selectors`, so
the gap was an oversight rather than a tiering decision. They are in the barrel now: 449 → 663
exports, nothing removed. Three modules stayed out deliberately — `utils/socket` (above),
`utils/interop-default` (a Node CJS/ESM interop shim) and `utils/add-log` (socket logging
against `window.ClientConfig`). Adding a name to the barrel is permanent in a way removing one
is not, so plumbing does not go in.

Two things fell out of closing it:

- **`getCookie` existed twice** — `utils/cookie` and `utils/i18n/i18n-utils` — and `export *`
  drops a name that resolves to two different declarations. Barrelling both would have _removed_
  `getCookie` from the plugin API with no error anywhere. `utils/i18n` now re-exports the one in
  `utils/cookie`, which also means i18n honours `?culture` on `/confirm/LinkInvite`.
- **`Dropzone` collided**: the kit's own `components/dropzone` against the raw `react-dropzone`
  component that `utils/react-dropzone-interop` wraps. The component keeps the name; the util
  exports only `useDropzone`.
- **Five components were listed and still missing.** `export * from "./x"` carries a module's
  named exports and silently drops its default, and `section`, `filter`, `navigation`,
  `status-message` and `article` export their component only by default. The folders were in
  the barrel, the paragraph above said so, and `Section`, `FilterInput`, `Navigation`,
  `StatusMessage` and `Article` were still absent from both `dist/esm/index.js` and the types —
  a plugin author found it, not a check. They are re-exported by name now (663 → 668), and
  `components/barrel.test.ts` fails when a folder's default export is not reachable from the
  barrel under some name.

### Not public, and why — the two that look like they should be

**`providers/Providers` (the composed root).** It composes ErrorBoundary, TranslationProvider,
ThemeProvider **and ApiProvider**, and calls `fetchProvidersData()` to load portal settings on
mount. It is portal-shaped by construction: an external consumer has no such endpoint. Publish
the three providers individually and let consumers compose their own root.

Removing `./api` from the barrel was not enough on its own: `Providers.tsx` imports
`ApiProvider`, so while it stayed exported the root barrel dragged `axios` into the core
through it. Both left `providers/index.ts`, and both remain importable by subpath.

**That did not make `axios` portal-only, and this document claimed otherwise until now.** The
root `index.ts` also exports `uploader` and `billing`, and each reaches `axios` by another
route:

```
index.js -> uploader/index.js        -> providers/api/ApiProvider/index.js -> axios
index.js -> billing/wallet/...       -> selectors/People/index.js          -> axios
```

Since `axios` is an _optional_ peer, `npm i @onlyoffice/apps-ui-kit` does not install it, and a
bare `import { Button } from "@onlyoffice/apps-ui-kit"` then fails to resolve for anyone who
bundles the barrel themselves. Observed, not inferred: the DocSpace plugin preview harness
reports `Could not resolve "axios" imported by "@onlyoffice/apps-ui-kit"` on a freshly generated
plugin. The portal is unaffected, because it supplies `axios` and hands plugins its own mounted
copy of the kit at runtime.

The cause is not `axios`. It is that `billing` and `uploader` are filed as portal-internal below
and exported from the root barrel anyway, so the "public core" is not what the barrel actually
pulls. Two ways out, and they are not equivalent:

- **Drop `billing` and `uploader` from `index.ts`**, leaving them on subpaths like the other
  portal-internal modules. Consistent with the tiering, and it makes the optional-peer split
  true — but it removes both from the plugin API, which is barrel-only.
- **Promote `axios` to a `dependency`.** Keeps every consumer working and costs external
  consumers one package they will not call, but it gives up the goal this section states.

Unresolved; tracked as open question 6.

**`utils/socket`.** The only importer of `socket.io-client` and
`@socket.io/component-emitter` in the whole library, and meaningful only against a DocSpace
portal's socket server. Keeping it out of the public surface moves both dependencies to
optional peers rather than removing them: the module still ships (`dist/esm/utils/socket`), and
it is reachable by subpath, but an external install downloads neither package.

**It is not, however, out of the barrel's reach, and this document claimed it was.** Tracing
`dist/esm/index.js` gives `index.js -> billing/wallet -> utils/socket -> socket.io-client`, so
`socket.io-client` leaks into the core by exactly the route `axios` does — through `billing`.
Keeping the _names_ out of the barrel is not the same as keeping the _module graph_ out of it;
only the tiering decision in open question 6 settles that. The modules reachable from the
barrel also pull `mobx`, `mobx-react` (`billing/store`) and `react-router`
(`billing/services`).

## Portal-internal

These **ship in the published package** and resolve normally — the monorepo depends on them 227
times and must be able to consume the built artifact uniformly (WP-12). What they lack is a
_contract_: no semver promise, no documentation for external use, no support.

The `exports` map therefore declares them, and the build emits them. The distinction is
editorial, not mechanical — which is why it has to be written down here rather than enforced by
resolution alone.

| Module            | Client imports | Why not public API                                                                                                              |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ai-agent`        | 80             | Depends on `@onlyoffice/ai-chat`, which cannot currently be published. Ships anyway, via optional peer dependencies — see below |
| `billing`         | 68             | Portal tariff/payment flows; depends on the API layer and MobX stores                                                           |
| `selectors`       | 70             | Data-driven pickers (People, Room, Files, Groups, MCPServers, AIAgent) built on the API layer and MobX                          |
| `uploader`        | 7              | Depends on `selectors/Files` and `providers/api`                                                                                |
| `document-editor` | 2              | Wrapper around `@onlyoffice/document-editor-react`; external consumers should use that package directly                         |
| `api`             | —              | Portal REST client                                                                                                              |
| `providers/api`   | —              | Portal API provider; sole importer of `axios`                                                                                   |
| `utils/socket`    | —              | See above                                                                                                                       |

**Two of them are in the root barrel**: `index.ts` exports `uploader` and `billing` alongside
the public modules, so they are portal-internal by tiering and public by resolution — and, since
the barrel is the plugin API, they are plugin API too. The others (`ai-agent`, `api`,
`selectors`, `document-editor`, `providers/api`, `utils/socket`) are subpath-only and therefore
unreachable from a plugin. That inconsistency is what leaks `axios` into the core; see above.

Any of these could be promoted to public later if there is external demand (D5). Promotion is
cheap — it means documenting and committing to semver, not moving code.

## Shipping `ai-agent` without a publishable `ai-chat`

`@onlyoffice/ai-chat` is a vendored `file:` tarball, and a published package with a `file:`
dependency is uninstallable for everyone. But `ai-agent` has to ship. The resolution is
**optional peer dependencies** — the same pattern `ai-chat` itself uses, and one that needs no
exception to the "externalize everything" build rule.

- `@onlyoffice/ai-chat` is declared as a **peer dependency marked optional**
  (`peerDependenciesMeta`).
- The build keeps it **external**; `dist/ai-agent/**` ships with a bare
  `@onlyoffice/ai-chat` specifier.
- `npm i @onlyoffice/apps-ui-kit` installs cleanly for everyone: an unsatisfied optional
  peer is neither fetched nor an error.
- Consumers who never import `ai-agent/*` — every external consumer, for now — are unaffected.
- The monorepo supplies `ai-chat` itself: the tarball declaration moves to the consuming
  package, or stays in the ui-kit workspace manifest for development.

The failure mode is loud and honest: importing `ai-agent/*` without supplying `ai-chat` fails at
build time naming the missing package. That is the opposite of the silent failures this
separation exists to prevent.

`ai-agent` is therefore unusable for external consumers until `ai-chat` is published. That
follows from the constraint, not from this design, and it is acceptable precisely because
`ai-agent` carries no public contract.

## Dependency consequences

Because every module now ships, the question is no longer "what does the core need" but **what
must a consumer install to use what they actually import**. The `ai-chat` mechanism generalises
into the rule:

> The public core's requirements are `dependencies`. Anything needed _only_ by portal-internal
> modules is an **optional peer dependency**.

That way `npm i @onlyoffice/apps-ui-kit` pulls what a component library legitimately needs
(~32 packages instead of 68), while the portal — which does import those modules — supplies the
rest from its own manifest.

### `dependencies` — the public core (~32)

What `components`, `utils`, `context`, `enums`, `constants`, `types`, `errors`, `hooks` and the
three public providers actually import. Notably including:

**`@onlyoffice/docspace-api-sdk`**, imported by 15 core files — `components/selector` (5),
`providers/theme` (2), `providers/translation`, `utils/common` and others — almost entirely for
types and enums such as `RoomType`, `FolderType` and `CustomColorThemesSettingsItem`. It was a
`file:` tarball, which is unpublishable; it is now `^3.7.0` from public npm. The switch is done,
but it was **not** a swap of identical artifacts, and the reason to record that is below:

|                                | npm 3.7.0                                                                                   | vendored 3.7.0 |
| ------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| Files                          | 2 649                                                                                       | 2 622          |
| Differing by content           | 83 files, incl. `LICENSE`, `README`, `chat-api`, `settings-api`, `files-settings-api`       |                |
| Present only on the other side | 27 model files (`ai-user-settings-*`, `external-sharing-settings-*`, `generated-file-*`, …) | **none**       |

The npm build is a strict superset by file presence — nothing is lost by switching — and the
two enums the core actually imports, `room-type.js` and `folder-type.js`, are byte-identical.
Both manifests declare version 3.7.0, Apache-2.0 and a single dependency.

So the switch was safe in the ways that matter here, but it was **not a no-op**: one version
number designated two different builds. That is a publishing-hygiene problem on the API SDK
side, and it means the vendored tarball was never a reliable record of what 3.7.0 is.
Reproducible builds (WP-5) depend on this not recurring — which is a reason to keep this note
after the switch, not to delete it with the blocker.

### `peerDependencies`, required

`react`, `react-dom` (relaxed to `^19.0.0`), plus **`i18next` and `react-i18next`** — imported
by `providers/translation`, and stateful, so a second copy in the consumer's tree breaks
translation silently. Peer, never bundled.

### `peerDependencies`, optional — portal-internal only

Declared so the portal can satisfy them and external consumers never download them. Fifteen,
and this is the whole list — every one is verified to be imported somewhere under this package
root:

| Package(s)                                                                                                       | Needed by                                                                  |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `@onlyoffice/ai-chat`                                                                                            | `ai-agent`                                                                 |
| `mobx`, `mobx-react` (84 importers, all portal)                                                                  | `selectors`, `billing`                                                     |
| `axios`                                                                                                          | `providers/api` — but see _Dependency consequences_: the barrel reaches it |
| `socket.io-client`, `@socket.io/component-emitter`                                                               | `utils/socket`                                                             |
| `react-router`                                                                                                   | portal navigation                                                          |
| `react-markdown`, `react-syntax-highlighter`, `rehype-katex`, `rehype-raw`, `remark-gfm`, `remark-math`, `katex` | `ai-agent` markdown rendering                                              |
| `@onlyoffice/document-editor-react`                                                                              | `document-editor`                                                          |

**`ai-chat`'s own optional peers are deliberately not here.** An earlier revision of this
document said they were, and they were declared for a while: the LLM vendor SDKs, the
assistant-ui packages, codemirror, radix and the rest. They were removed again, because nothing
in this package imports them and pnpm installs neither peers nor optional peers — so declaring
them satisfied nothing and only duplicated a list nobody kept in sync. `ai-chat` declares its
own peers; supplying them is the consuming app's job, and the DocSpace client carries the list
in its `pnpm-workspace.yaml` catalog for the apps that render the AI agent.

### The 15 packages nobody imported — resolved

Fifteen of ui-kit's `dependencies` once had **zero imports** anywhere in the library. They were
not dead weight: `@onlyoffice/ai-chat` declares **32 peer dependencies, 28 of them optional**,
and those entries existed purely to satisfy them.

That whole arrangement is gone. `dependencies` now holds 32 packages, all imported;
`react-virtualized-auto-sizer` was dropped outright; `@babel/runtime` is gone too, and the build
does not miss it. What remains is `ai-chat`'s peer list, which this package deliberately no
longer mirrors — see the note above.

The consequence is worth stating plainly rather than leaving as a worry: **an app that renders
`ai-agent` must satisfy `ai-chat`'s peers itself.** Anything it misses switches an `ai-chat`
feature off silently, which is what an unsatisfied optional peer does. Two of them
(`@assistant-ui/react`, `assistant-stream`) are _required_ peers of `ai-chat`, so those fail
loudly instead. Nothing here checks either; the `ai-agent` tests do not reach the code paths
that load them.

## Subpath contract

Deep imports stay supported — 2 974 of the 4 060 import sites are `components/*`, and breaking
them is not on the table. The `exports` map is deliberately small:

| Key              | Serves                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `.`              | the barrel                                                                                                    |
| `./styles.css`   | the whole-library stylesheet, for consumers that cannot take the per-module CSS each component imports itself |
| `./package.json` | required by tooling                                                                                           |
| `./locales/*`    | the vendored translations                                                                                     |
| `./styles/*`     | raw Sass sources, the form every `@use` in the portal writes                                                  |
| `./*`            | **one wildcard for every module subpath**, public and portal-internal alike                                   |

There is no per-module list. The build emits a single shape — `<subpath>/index.js` for the
JavaScript, `<subpath>/index.d.mts` for the types — so one wildcard serves all of it, which is
what replaced 916 generated entries and the script that wrote them. The cost is that the
wildcard cannot serve anything that is not an `index` file: a plain (non-module) stylesheet is
emitted as `<Name>.scss/index.css` with no `index.js` beside it, so it has no subpath at all and
has to be reached through the module that imports it. `scripts/check-dist.mjs` enforces the
shape the wildcard depends on.

`hooks` is in the barrel. `assets` is not, and deliberately: hundreds of SVG modules, where a
barrel would defeat tree-shaking. Twenty-two icons reach the barrel anyway, re-exported by name
from `components/quick-actions/icons.ts` and `components/nav-menu/icons.ts` — a leak rather than
a decision, and plugin API by accident, since the barrel is all a plugin can import. Six types
from `@onlyoffice/docspace-api-sdk` arrive the same way through `types/` and `enums/`.

## Enforcement

Partly machine-checked. What runs:

- **The `exports` map** — anything undeclared stops resolving.
- **`publint` and `attw` against the packed tarball**, in the blocking `package` CI job
  (`pnpm verify:package`). Note it is `attw <tarball>`, not `attw --pack .`: `publishConfig`
  field overrides are a pnpm feature, and an npm-packed tarball has no `exports` and no `main`,
  so `--pack` reports total failure for the wrong reason.
- **`scripts/check-dist.mjs`**, at the end of `pnpm build` — no bundled dependencies, every
  emitted module an `index` file, and a `"use client"` in `dist` for each of the 55 modules that
  declare one.
- **An API-surface snapshot** — `docs/plugin-surface.json`, written and diffed by
  `.claude/scripts/plugin-surface/surface.mjs`. It fails on a removed or re-kinded export, which
  is the change no compiler reports.

What does not exist yet, though an earlier revision of this section listed it as if it did:
**clean-install smoke tests against bare Vite and Next.js apps.** Nothing exercises the package
from outside a pnpm workspace, which is exactly where the monorepo's own resolution hides
defects — the `axios` case above is one such defect, and it was found by a plugin preview
harness in another repository rather than by anything here.

## Open questions

1. ~~Does the published package ship the portal-internal modules?~~ **Answered: yes.** They
   ship; `ai-agent` works through optional peer dependencies until `@onlyoffice/ai-chat` can be
   published.
   ~~The 15 packages nobody imports~~ **Done: moved to optional peers.** `mobx`, `mobx-react`,
   `axios`, `socket.io-client`, `@socket.io/component-emitter`, `react-router`,
   `react-markdown`, `react-syntax-highlighter`, `rehype-katex`, `rehype-raw`, `remark-gfm`,
   `remark-math`, `@onlyoffice/document-editor-react` and `ai-chat`'s own peer list (including
   the two required-but-accidental `@assistant-ui/react` and `assistant-stream`) are now
   declared in `peerDependencies` with `peerDependenciesMeta.optional: true`, mirrored into
   `devDependencies` so the monorepo workspace still resolves them for local builds/tests.
   `react-virtualized-auto-sizer` (unused, not an `ai-chat` peer) was dropped outright.
   `publint` now passes clean against the packed tarball.
   **Amended:** `ai-chat`'s own peer list was subsequently removed again — nothing here imports
   those packages and pnpm installs neither peers nor optional peers, so declaring them
   satisfied nothing. The fifteen optional peers that remain are listed under
   _`peerDependencies`, optional_.
2. ~~Should the ONLYOFFICE icons move to MIT with the code?~~ **Answered: no — the package was
   briefly relicensed under MIT and that was reverted; everything here is AGPL-3.0-only.**
   `LICENSE` is the verbatim AGPL-3.0 text and nothing else: the same file the umbrella
   `DocSpace` repository carries, with no ONLYOFFICE addendum and no per-file headers, so the
   declaration rests on `package.json`, `LICENSE` and the README. The supplemental terms that
   cover non-code elements — CC BY-SA 4.0 for illustrations, icon sets and technical writing,
   plus the trademark exclusion — are stated in DocSpace-client's own `LICENSE`, not in this
   repository; the 246 icons mirrored into that repository are governed by it there.
3. **Should the core drop `@onlyoffice/docspace-api-sdk`** by inlining the handful of enums and
   types it uses, rather than depending on the portal's API SDK? Not required for publication —
   but note that six of its types now reach the root barrel, so a plugin author inherits the
   package without ever naming it.
4. ~~**`@babel/runtime`** — required by the build output, or removable?~~ **Answered:
   removable.** It is no longer in `dependencies` and the build does not miss it.
5. **Are the unsatisfied `ai-chat` optional peers intentional?** Owner: whoever maintains
   `ai-agent`. Now a question for the consuming app rather than for this package, since the
   peer list is no longer mirrored here.
6. **`axios` is not portal-only, and cannot be while `billing` and `uploader` are in the root
   barrel.** The two ways out are in _Dependency consequences_; they trade the tiering against
   the plugin API, so this is a product decision, not a packaging one. Until it is taken, an
   external consumer who bundles the barrel must install `axios` themselves.
